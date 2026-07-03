"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { TbQuote } from "react-icons/tb";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/content";
import { cn } from "@/lib/utils";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [go]);

  const current = testimonials[index];

  return (
    <section id="testimonials" className="relative overflow-hidden bg-bg py-28 sm:py-36">
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeading
          kicker="Client Word"
          title="Trusted by the industries we power."
          align="center"
          className="mb-16"
        />

        <div className="glass border-glow relative overflow-hidden rounded-3xl p-10 sm:p-16">
          <TbQuote className="absolute left-8 top-8 text-6xl text-primary/15" />
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-8 text-center"
              >
                <p className="max-w-2xl font-display text-2xl font-medium leading-snug tracking-tight text-text sm:text-3xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div>
                  <p className="font-medium text-text">{current.name}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {current.role} — {current.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary/60 hover:text-primary"
              aria-label="Previous testimonial"
            >
              <HiChevronLeft />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === index ? "w-8 bg-primary" : "w-1.5 bg-white/15"
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary/60 hover:text-primary"
              aria-label="Next testimonial"
            >
              <HiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
