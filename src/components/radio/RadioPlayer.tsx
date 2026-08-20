"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RadioTrack } from "@/data/radio";

/**
 * تشغيل صوت إذاعة الفرات من موادّ قناة الفرات الرسمية على YouTube عبر
 * IFrame API. لا تنزيل ولا استخراج ولا تحويل للصوت — الإطار الرسمي نفسه هو
 * ما يعمل، ويُعرض طبقةً بصرية ضبابية خلف الواجهة.
 *
 * التشغيل لا يبدأ إلا بنقرة المستخدم (لا autoplay عند فتح الصفحة).
 */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  loadVideoById(id: string): void;
  destroy(): void;
}

interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_SRC = "https://www.youtube.com/iframe_api";
let apiPromise: Promise<void> | null = null;

/** يحمّل IFrame API مرّة واحدة، ويسمح بإعادة المحاولة إن فشل */
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), 9000);
    const done = () => { window.clearTimeout(timer); resolve(); };

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); done(); };

    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = API_SRC;
      s.async = true;
      s.onerror = () => { window.clearTimeout(timer); reject(new Error("blocked")); };
      document.head.appendChild(s);
    }
  }).catch((e) => { apiPromise = null; throw e; });

  return apiPromise;
}

export type RadioStatus = "idle" | "loading" | "ready" | "error";

export interface RadioEngine {
  status: RadioStatus;
  playing: boolean;
  muted: boolean;
  volume: number;
  time: number;
  duration: number;
  start: () => void;
  toggle: () => void;
  select: (index: number) => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

/**
 * يعيد [حالة المشغّل، مرجع الحاوية]. المرجع يُعاد منفصلاً عن كائن الحالة
 * لأنّه يُركَّب على عنصر JSX ولا يُقرأ أثناء العرض.
 */
export function useRadioEngine(
  playlist: RadioTrack[], index: number, setIndex: (i: number) => void,
): [RadioEngine, React.RefObject<HTMLDivElement | null>] {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const indexRef = useRef(index);

  const [status, setStatus] = useState<RadioStatus>("idle");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVol] = useState(0.8);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const volumeRef = useRef(volume);

  /** ينتقل إلى المقطع التالي في القائمة */
  const advance = useCallback((step: number) => {
    const n = playlist.length;
    const nextIndex = ((indexRef.current + step) % n + n) % n;
    setIndex(nextIndex);
    setTime(0);
    setDuration(0);
    if (playerRef.current) playerRef.current.loadVideoById(playlist[nextIndex].yt);
  }, [playlist, setIndex]);

  const advanceRef = useRef(advance);

  // مزامنة المراجع بعد كل عرض — لا تُكتب أثناء العرض نفسه
  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  const start = useCallback(() => {
    if (playerRef.current || status === "loading") return;
    setStatus("loading");

    loadYouTubeApi()
      .then(() => {
        const host = hostRef.current;
        if (!host || !window.YT?.Player) throw new Error("no-host");

        const mount = document.createElement("div");
        host.appendChild(mount);

        playerRef.current = new window.YT.Player(mount, {
          videoId: playlist[indexRef.current].yt,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1,
            rel: 0, playsinline: 1, iv_load_policy: 3, fs: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (e: { target: YTPlayer }) => {
              e.target.setVolume(Math.round(volumeRef.current * 100));
              e.target.unMute();
              e.target.playVideo();
              setMuted(false);
              setStatus("ready");
            },
            onStateChange: (e: { data: number }) => {
              // 1 = تشغيل، 2 = إيقاف مؤقت، 0 = انتهى
              if (e.data === 1) { setPlaying(true); setStatus("ready"); }
              else if (e.data === 2) setPlaying(false);
              else if (e.data === 0) { setPlaying(false); advanceRef.current(1); }
            },
            onError: () => { setStatus("error"); setPlaying(false); },
          },
        });
      })
      .catch(() => setStatus("error"));
  }, [playlist, status]);

  // مهلة أمان: إن لم يجهز المشغّل تُعرض البدائل بدل الانتظار الصامت
  useEffect(() => {
    if (status !== "loading") return;
    const t = window.setTimeout(() => {
      setStatus((s) => (s === "loading" ? "error" : s));
    }, 12_000);
    return () => window.clearTimeout(t);
  }, [status]);

  // متابعة الزمن المنقضي
  useEffect(() => {
    if (status !== "ready") return;
    const t = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        setTime(p.getCurrentTime() || 0);
        setDuration(p.getDuration() || 0);
      } catch { /* المشغّل يُهيَّأ بعد */ }
    }, 400);
    return () => window.clearInterval(t);
  }, [status]);

  useEffect(() => () => {
    try { playerRef.current?.destroy(); } catch { /* تجاهل */ }
    playerRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) { start(); return; }
    if (playing) p.pauseVideo(); else p.playVideo();
  }, [playing, start]);

  const select = useCallback((i: number) => {
    setIndex(i);
    setTime(0);
    setDuration(0);
    const p = playerRef.current;
    if (!p) { start(); return; }
    p.loadVideoById(playlist[i].yt);
  }, [playlist, setIndex, start]);

  const seek = useCallback((ratio: number) => {
    const p = playerRef.current;
    if (!p || !duration) return;
    const target = Math.max(0, Math.min(1, ratio)) * duration;
    p.seekTo(target, true);
    setTime(target);
  }, [duration]);

  const setVolume = useCallback((v: number) => {
    setVol(v);
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(Math.round(v * 100));
    if (v > 0 && muted) { p.unMute(); setMuted(false); }
  }, [muted]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    setMuted((m) => {
      if (p) { if (m) p.unMute(); else p.mute(); }
      return !m;
    });
  }, []);

  return [
    {
      status, playing, muted, volume, time, duration,
      start, toggle, select, next: () => advance(1), prev: () => advance(-1),
      seek, setVolume, toggleMute,
    },
    hostRef,
  ];
}

/** مؤشّر طيفي يتجاوب مع حالة التشغيل */
export function Equalizer({ active, bars = 52, className }: {
  active: boolean; bars?: number; className?: string;
}) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 70) { setSeed(t / 1000); last = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div aria-hidden className={`flex items-end justify-between gap-[2px] ${className ?? ""}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const wave = Math.abs(Math.sin(i * 0.68 + seed * 2.3) * Math.cos(i * 0.29 - seed * 1.6));
        const h = active ? 12 + wave * 88 : 10 + Math.abs(Math.sin(i * 1.37)) * 22;
        return (
          <span
            key={i}
            className="flex-1 rounded-full"
            style={{
              height: `${h}%`,
              minWidth: 2,
              background: active
                ? "linear-gradient(to top, var(--color-broadcast), var(--color-cyan))"
                : "rgba(255,255,255,.18)",
              opacity: active ? 0.55 + (i % 5) * 0.09 : 1,
              transition: "height 90ms linear, opacity 200ms",
            }}
          />
        );
      })}
    </div>
  );
}

export function fmtTime(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return h ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}
