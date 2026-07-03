"use client";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/content";

const machining = services.find((s) => s.id === "machining")!;
const fabrication = services.find((s) => s.id === "fabrication")!;

const panels = [machining, fabrication];

export default function MachiningFabrication() {
  return (
    <section className="relative overflow-hidden bg-surface py-28 sm:py-36">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          kicker="Precision in Motion"
          title="Where machining meets craftsmanship."
          description="CNC precision and hand-forged fabrication, executed under the same roof — every spark represents a tolerance held, a joint strengthened, a component perfected."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {panels.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.1}>
              <div className="group relative h-[480px] overflow-hidden rounded-3xl border border-border bg-bg">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,213,255,0.08),transparent_65%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />

                <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-10">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                    {service.index} — {service.short}
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-medium tracking-tight text-text sm:text-4xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {service.points.map((p) => (
                      <li
                        key={p}
                        className="rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-secondary"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
