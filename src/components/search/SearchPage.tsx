"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Poster } from "@/components/ui/Media";
import { Meta } from "@/components/ui/Bits";
import { search, KIND_LABEL, SUGGESTIONS, DATE_FILTERS, type ResultKind } from "@/lib/search";
import { relativeTime, cx } from "@/lib/format";

const KINDS: { key: ResultKind | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "news", label: "أخبار" },
  { key: "video", label: "فيديو" },
  { key: "program", label: "برامج" },
  { key: "short", label: "Shorts" },
];

export function SearchPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = sp.get("q") ?? "";

  const [q, setQ] = useState(initial);
  const [kind, setKind] = useState<ResultKind | "all">("all");
  const [date, setDate] = useState<(typeof DATE_FILTERS)[number]["key"]>("any");

  // مزامنة الحقل مع ?q= عند تغيّر الرابط
  const [syncedQ, setSyncedQ] = useState(initial);
  if (initial !== syncedQ) { setSyncedQ(initial); setQ(initial); }

  const hours = DATE_FILTERS.find((d) => d.key === date)!.hours;
  const results = useMemo(
    () => search(q, {
      kinds: kind === "all" ? undefined : [kind],
      withinHours: hours || undefined,
      limit: 120,
    }),
    [q, kind, hours],
  );

  const counts = useMemo(() => {
    const base = search(q, { withinHours: hours || undefined, limit: 500 });
    return {
      all: base.length,
      news: base.filter((r) => r.kind === "news").length,
      video: base.filter((r) => r.kind === "video").length,
      program: base.filter((r) => r.kind === "program").length,
      short: base.filter((r) => r.kind === "short").length,
    } as Record<string, number>;
  }, [q, hours]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="zone-light">
      <header className="border-b border-[color:var(--line)] bg-[color:var(--surface-2)]">
        <div className="shell py-8 md:py-10">
          <h1 className="text-[26px] font-extrabold text-[color:var(--fg)] md:text-[34px]">البحث في الفرات</h1>
          <p className="mt-2 text-[13.5px] text-[color:var(--fg-2)]">
            بحث داخل الأخبار والفيديو والبرامج و Shorts
          </p>

          <form onSubmit={submit} className="mt-5 flex gap-2">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-[color:var(--line-2)] bg-[color:var(--surface)] px-4 py-3 focus-within:border-[color:var(--accent)]">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[color:var(--accent)]">
                <circle cx="9" cy="9" r="6.3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M13.6 13.6L17.5 17.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoFocus
                placeholder="اكتب كلمة البحث…"
                className="min-w-0 flex-1 bg-transparent text-[15.5px] text-[color:var(--fg)] outline-none placeholder:text-[color:var(--fg-3)]"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} aria-label="مسح"
                  className="focusable text-[color:var(--fg-3)] transition hover:text-[color:var(--fg)]">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            <button type="submit"
              className="focusable rounded-xl bg-[color:var(--accent)] px-5 text-[13.5px] font-extrabold text-white transition hover:brightness-110">
              بحث
            </button>
          </form>

          {!q && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold text-[color:var(--fg-3)]">بحث شائع:</span>
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setQ(s)}
                  className="focusable rounded-full border border-[color:var(--line-2)] bg-[color:var(--surface)] px-3 py-1.5 text-[12.5px] font-medium text-[color:var(--fg-2)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="shell py-7">
        {/* الفلاتر */}
        <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-[color:var(--line)] pb-4">
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k.key}
                onClick={() => setKind(k.key)}
                className={cx(
                  "focusable flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition",
                  kind === k.key
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--line-2)] text-[color:var(--fg-2)] hover:border-[color:var(--accent)]",
                )}
              >
                {k.label}
                <span className={cx("num text-[10.5px]", kind === k.key ? "opacity-80" : "opacity-60")}>
                  {counts[k.key] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 md:mr-auto">
            <span className="text-[12px] font-bold text-[color:var(--fg-3)]">التاريخ:</span>
            {DATE_FILTERS.map((d) => (
              <button
                key={d.key}
                onClick={() => setDate(d.key)}
                className={cx(
                  "focusable rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                  date === d.key
                    ? "bg-[color:var(--fg)] text-[color:var(--surface)]"
                    : "text-[color:var(--fg-2)] hover:bg-[color:var(--surface-2)]",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-[13px] text-[color:var(--fg-2)]">
          {q ? <>نتائج البحث عن «<b className="text-[color:var(--fg)]">{q}</b>»: </> : "أحدث المواد: "}
          <span className="num font-bold">{results.length}</span> نتيجة
        </p>

        {results.length === 0 ? (
          <div className="card rounded-2xl px-6 py-14 text-center">
            <p className="text-[15px] font-bold text-[color:var(--fg)]">لا نتائج مطابقة</p>
            <p className="mt-2 text-[13px] text-[color:var(--fg-3)]">
              جرّب كلمة أعم أو غيّر الفلاتر.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {results.map((r) => (
              <li key={`${r.kind}-${r.id}`}>
                <Link
                  href={r.href}
                  className="focusable card group grid grid-cols-[100px_1fr] gap-3.5 overflow-hidden rounded-xl p-2.5 transition hover:shadow-[var(--shadow-hover)] sm:grid-cols-[170px_1fr] sm:gap-4"
                >
                  <div className={cx(
                    "relative overflow-hidden rounded-lg bg-midnight",
                    r.kind === "short" ? "aspect-9/16" : "aspect-16/9",
                  )}>
                    <Poster src={r.image} alt={r.title} sizes="170px" />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <span
                      className="w-fit rounded px-2 py-[2px] text-[10px] font-extrabold text-white"
                      style={{ background: r.accent }}
                    >
                      {KIND_LABEL[r.kind]}
                    </span>
                    <h2 className="clamp-2 mt-1.5 text-[14.5px] font-extrabold leading-[1.45] text-[color:var(--fg)] transition group-hover:text-[color:var(--accent)] sm:text-[16px]">
                      {r.title}
                    </h2>
                    <p className="clamp-2 mt-1.5 text-[12.5px] text-[color:var(--fg-2)]">{r.sub}</p>
                    {r.agoMin < 100_000 && (
                      <Meta className="mt-1.5">{relativeTime(r.agoMin)}</Meta>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
