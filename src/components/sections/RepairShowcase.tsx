"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SceneErrorBoundary from "@/components/three/SceneErrorBoundary";
import SceneFallback from "@/components/three/SceneFallback";
import { isWebglSupported } from "@/lib/webgl";
import { useInView } from "@/lib/useInView";

const ExplodedScene = dynamic(() => import("@/components/three/ExplodedScene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    tag: "Stage 01",
    title: "Full Diagnostics",
    text: "Every cylinder enters the workshop for complete failure analysis — pressure testing, seal inspection, and rod surface evaluation under precision instrumentation.",
  },
  {
    tag: "Stage 02",
    title: "Controlled Disassembly",
    text: "Each component is carefully separated — barrel, gland, piston, rod, and ports — logged and inspected individually for wear tolerance against OEM specification.",
  },
  {
    tag: "Stage 03",
    title: "Precision Rebuild",
    text: "Machined, resealed, and reassembled to exact tolerance. Every hydraulic cylinder is pressure-tested before it leaves our floor — restored to full working force.",
  },
];

export default function RepairShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [webglOk] = useState(isWebglSupported);
  const inView = useInView(sectionRef, "500px");

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=3000",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress < 0.7 ? self.progress / 0.7 : 1;
        const next = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
        setStage((prev) => (prev !== next ? next : prev));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-bg"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="absolute inset-0">
        {webglOk && inView ? (
          <SceneErrorBoundary fallback={<SceneFallback />}>
            <ExplodedScene progressRef={progressRef} />
          </SceneErrorBoundary>
        ) : (
          <SceneFallback />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,transparent_30%,rgba(5,5,5,0.75)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8">
        <div className="max-w-lg">
          <div className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Hydraulic Repair Service
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                {stages[stage].tag}
              </span>
              <h3 className="mt-4 font-display text-4xl font-medium tracking-tight text-text sm:text-5xl">
                {stages[stage].title}
              </h3>
              <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
                {stages[stage].text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-3">
            {stages.map((s, i) => (
              <div key={s.tag} className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-1.5 w-10 rounded-full transition-colors duration-500",
                    i <= stage ? "bg-primary" : "bg-white/10"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
