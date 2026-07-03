"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

const roofing = services.find((s) => s.id === "roofing")!;

const ROWS = 2;
const COLS = 6;

export default function RoofingShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      gsap.set(panels, (i: number) => ({
        y: i % 2 === 0 ? -180 - Math.random() * 120 : 180 + Math.random() * 120,
        x: (Math.random() - 0.5) * 160,
        rotate: (Math.random() - 0.5) * 40,
        opacity: 0,
      }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1300",
          pin: true,
          scrub: 1,
        },
      });

      tl.to(panels, {
        y: 0,
        x: 0,
        rotate: 0,
        opacity: 1,
        stagger: { each: 0.045, from: "random" },
        ease: "power2.out",
        duration: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-bg">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8">
        <div className="mb-12 max-w-lg">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {roofing.index} — Industrial Roofing Works
          </span>
          <h3 className="mt-4 font-display text-4xl font-medium tracking-tight text-text sm:text-5xl">
            {roofing.title}
          </h3>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
            {roofing.description}
          </p>
        </div>

        <div
          className="grid gap-1.5 [perspective:1200px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                panelsRef.current[i] = el;
              }}
              className="h-16 rounded-md border border-white/10 sm:h-24"
              style={{
                background:
                  "linear-gradient(135deg, rgba(138,143,152,0.9) 0%, rgba(60,64,70,0.9) 45%, rgba(0,213,255,0.25) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
