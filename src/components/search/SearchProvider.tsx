"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { search, KIND_LABEL, SUGGESTIONS, type ResultKind } from "@/lib/search";
import { relativeTime, cx } from "@/lib/format";

const Ctx = createContext<{ open: () => void; close: () => void; isOpen: boolean }>({
  open: () => {}, close: () => {}, isOpen: false,
});

export const useSearch = () => useContext(Ctx);

const FILTERS: { key: ResultKind | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "news", label: "أخبار" },
  { key: "video", label: "فيديو" },
  { key: "program", label: "برامج" },
  { key: "short", label: "Shorts" },
];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<ResultKind | "all">("all");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => { setOpen(false); setQ(""); setActive(0); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const results = useMemo(
    () => search(q, { kinds: kind === "all" ? undefined : [kind], limit: 12 }),
    [q, kind],
  );

  // إعادة المؤشّر إلى أول نتيجة كلّما تغيّر الاستعلام أو النوع
  const filterKey = `${q}\u0000${kind}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) { setLastFilterKey(filterKey); setActive(0); }

  const go = (href: string) => { close(); router.push(href); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active].href);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex justify-center px-3 pt-[8vh] md:pt-[12vh]">
          <button
            aria-label="إغلاق البحث"
            onClick={close}
            className="absolute inset-0 bg-midnight/85 backdrop-blur-md"
          />
          <div className="relative w-full max-w-[720px] anim-rise">
            <div className="glass overflow-hidden rounded-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,.8)]">
              {/* حقل البحث */}
              <div className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3.5">
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none" className="shrink-0 text-cyan">
                  <circle cx="9" cy="9" r="6.3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M13.6 13.6L17.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="ابحث في أخبار الفرات، البرامج، الفيديو و Shorts…"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-[color:var(--fg)] outline-none placeholder:text-[color:var(--fg-3)]"
                />
                <kbd className="ltr-num hidden rounded border border-[color:var(--line)] px-1.5 py-0.5 text-[10px] text-[color:var(--fg-3)] md:block">
                  ESC
                </kbd>
              </div>

              {/* الفلاتر */}
              <div className="flex gap-1.5 overflow-x-auto border-b border-[color:var(--line)] px-3 py-2 [scrollbar-width:none]">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setKind(f.key)}
                    className={cx(
                      "focusable shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition",
                      kind === f.key
                        ? "bg-cyan/15 text-cyan ring-1 ring-cyan/35"
                        : "text-[color:var(--fg-2)] hover:bg-white/5 hover:text-[color:var(--fg)]",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* النتائج */}
              <div className="max-h-[52vh] overflow-y-auto overscroll-contain">
                {!q && (
                  <div className="p-4">
                    <p className="mb-2.5 text-[11px] font-semibold tracking-wide text-[color:var(--fg-3)]">
                      بحث شائع
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQ(s)}
                          className="focusable rounded-full border border-[color:var(--line)] px-3 py-1.5 text-[12.5px] text-[color:var(--fg-2)] transition hover:border-cyan/40 hover:text-cyan"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="mt-5 text-[11px] font-semibold tracking-wide text-[color:var(--fg-3)]">
                      أحدث المواد
                    </p>
                  </div>
                )}

                {q && results.length === 0 && (
                  <p className="px-4 py-10 text-center text-[13px] text-[color:var(--fg-3)]">
                    لا نتائج مطابقة لـ «{q}» في مواد العرض الحالية.
                  </p>
                )}

                {results.map((r, i) => (
                  <button
                    key={`${r.kind}-${r.id}`}
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setActive(i)}
                    className={cx(
                      "flex w-full items-start gap-3 border-b border-[color:var(--line)] px-4 py-3 text-right transition last:border-0",
                      i === active ? "bg-cyan/8" : "hover:bg-white/[.03]",
                    )}
                  >
                    <span
                      className="mt-[3px] shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: `${r.accent}18`, color: r.accent }}
                    >
                      {KIND_LABEL[r.kind]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="clamp-2 block text-[13.5px] font-semibold leading-snug text-[color:var(--fg)]">
                        {r.title}
                      </span>
                      <span className="clamp-1 mt-1 block text-[11.5px] text-[color:var(--fg-3)]">{r.sub}</span>
                    </span>
                    {r.agoMin > 0 && (
                      <span className="mt-1 shrink-0 text-[10.5px] text-[color:var(--fg-3)]">
                        {relativeTime(r.agoMin)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {q && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}`}
                  onClick={close}
                  className="block border-t border-[color:var(--line)] bg-[color:var(--surface-2)] px-4 py-3 text-center text-[12.5px] font-medium text-cyan transition hover:bg-cyan/10"
                >
                  عرض كل النتائج في صفحة البحث ←
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
