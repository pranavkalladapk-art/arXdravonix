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

const RoofScene = dynamic(() => import("@/components/three/RoofScene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    tag: "Stage 01",
    title: "Structural Framing",
    text: "Rafters and purlins are fabricated to specification and hoisted into position, forming the load-bearing skeleton of the roofing system.",
  },
  {
    tag: "Stage 02",
    title: "Panel Installation",
    text: "Corrugated steel panels are precision-fitted and fastened across the frame, sheet by sheet, for complete structural coverage.",
  },
  {
    tag: "Stage 03",
    title: "Weatherproof Sealing",
    text: "Seams are sealed and flashing installed to deliver a fully weatherproofed, long-life industrial roof built for large-scale facilities.",
  },
];

export default function RoofingShowcase() {
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
        progressRef.current = self.progress;
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
            <RoofScene progressRef={progressRef} />
          </SceneErrorBoundary>
        ) : (
          <SceneFallback />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,transparent_30%,rgba(5,5,5,0.75)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8">
        <div className="max-w-lg">
          <div className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Industrial Roofing Works
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
