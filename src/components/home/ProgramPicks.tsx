import Link from "next/link";
import { Poster } from "@/components/ui/Media";
import { SectionHead } from "@/components/ui/Bits";
import { PROGRAMS, programCover } from "@/data/programs";

export function ProgramPicks() {
  const picks = PROGRAMS.filter((p) => p.flagship).slice(0, 5);
  return (
    <section>
      <SectionHead
        title="برامج الفرات"
        sub="مختارات من شبكة البرامج والنشرات — الأغلفة من القناة الرسمية"
        href="/programs"
        hrefLabel="دليل البرامج"
        accent="#c9bfa3"
      />
      <div className="rail -mx-1 px-1 pb-1 md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {picks.map((p) => (
          <Link
            key={p.slug}
            href={`/programs/${p.slug}`}
            className="focusable group relative block w-[200px] shrink-0 overflow-hidden rounded-xl bg-midnight ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-cyan/50 md:w-auto"
          >
            <div className="relative aspect-16/9 overflow-hidden">
              <Poster src={programCover(p)} alt={p.title} sizes="(max-width:768px) 200px, 20vw" />
            </div>
            <div className="p-3.5">
              <h3 className="text-[15.5px] font-extrabold text-white transition group-hover:text-cyan">{p.title}</h3>
              {p.host && <p className="clamp-1 mt-1 text-[11.5px] text-white/70">{p.host}</p>}
              <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-white/55">
                <span className="size-[4px] rounded-full" style={{ background: p.accent }} />
                {p.airtime
                  ? <>{p.airtime.days.join(" · ")} — <span className="num">{p.airtime.time}</span></>
                  : "ضمن شبكة برامج الفرات"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
