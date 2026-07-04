"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiOutlineArrowUpRight, HiOutlineChevronDown } from "react-icons/hi2";
import MagneticButton from "@/components/ui/MagneticButton";
import SceneErrorBoundary from "@/components/three/SceneErrorBoundary";
import SceneFallback from "@/components/three/SceneFallback";
import { company } from "@/data/content";
import { isWebglSupported } from "@/lib/webgl";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [webglOk] = useState(isWebglSupported);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ric = window.requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    const cic = window.cancelIdleCallback as ((id: number) => void) | undefined;

    const id = ric ? ric(() => setReady(true), { timeout: 1200 }) : window.setTimeout(() => setReady(true), 250);

    return () => {
      if (ric && cic) cic(id);
      else window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[720px] w-full items-center overflow-hidden bg-bg"
    >
      {/* Blueprint grid background */}
      <div className="blueprint-grid pointer-events-none absolute inset-0 mask-fade-b opacity-70" />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        {webglOk && ready ? (
          <SceneErrorBoundary fallback={<SceneFallback />}>
            <HeroScene scrollRef={scrollRef} pointerRef={pointerRef} />
          </SceneErrorBoundary>
        ) : (
          <SceneFallback />
        )}
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,5,0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-primary"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Precision Engineering Since Day One
          </motion.div>

          <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight text-text sm:text-6xl lg:text-[5.5rem]">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-gradient glow-text"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Engineered
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                for Power &amp;
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
              >
                Precision.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {company.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#services">
              Explore Services
              <HiOutlineArrowUpRight />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Request a Quote
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-secondary"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <HiOutlineChevronDown className="animate-bounce" />
      </motion.div>
    </section>
  );
}
