"use client";

import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionHeading from "@/components/ui/SectionHeading";
import { stats } from "@/data/content";

export default function StatsAbout() {
  return (
    <section id="excellence" className="relative overflow-hidden bg-bg py-28 sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-2 lg:gap-8">
        <SectionHeading
          kicker="Industrial Excellence"
          title="Two decades of precision, power, and manufacturing mastery."
          description="Every hydraulic system we touch is treated as a piece of precision engineering — not a repair job. Our workshop combines certified craftsmanship with modern machining and testing infrastructure to deliver results that outlast expectations."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="glass border-glow group relative flex h-full flex-col justify-between gap-6 rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-4xl font-medium text-gradient sm:text-5xl"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
