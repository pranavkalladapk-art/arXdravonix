"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { process } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const setTween = () => {
        const distance = track.scrollWidth - window.innerWidth;
        if (distance <= 0) return null;

        return gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance + window.innerHeight * 0.15}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      };

      const tween = setTween();
      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative h-[100svh] overflow-hidden bg-surface">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="mx-auto mb-14 w-full max-w-7xl px-6 sm:px-8">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            <span className="h-px w-8 bg-primary/60" />
            Our Process
          </div>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-text sm:text-5xl lg:text-6xl">
            Five stages. Zero compromise.
          </h2>
        </div>

        <div ref={trackRef} className="flex gap-6 px-6 will-change-transform sm:px-8" style={{ width: "max-content" }}>
          {process.map((step) => (
            <div
              key={step.index}
              className="glass border-glow relative flex h-72 w-[300px] shrink-0 flex-col justify-between rounded-3xl p-8 sm:w-[360px]"
            >
              <span className="font-display text-6xl font-medium text-white/10">
                {step.index}
              </span>
              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
          <div className="flex h-72 w-[240px] shrink-0 items-center">
            <div className="h-px w-full bg-gradient-to-r from-primary/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
