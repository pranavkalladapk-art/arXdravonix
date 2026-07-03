"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: "warm" | "cyan";
}

export default function SparkCanvas({
  originX = 0.5,
  className,
}: {
  originX?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let sparks: Spark[] = [];
    let raf = 0;
    let visible = false;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      const originPx = width * originX;
      const count = reduceMotion ? 1 : 2;
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const speed = 2 + Math.random() * 4;
        sparks.push({
          x: originPx + (Math.random() - 0.5) * 20,
          y: height * 0.55,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 40 + Math.random() * 40,
          size: 1 + Math.random() * 1.8,
          hue: Math.random() > 0.25 ? "warm" : "cyan",
        });
      }
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      if (Math.random() > 0.4) spawn();

      sparks = sparks.filter((s) => s.life < s.maxLife);
      for (const s of sparks) {
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12;
        s.vx *= 0.99;
        const alpha = 1 - s.life / s.maxLife;
        ctx.beginPath();
        const color =
          s.hue === "warm"
            ? `rgba(255, ${170 + Math.random() * 60}, 90, ${alpha})`
            : `rgba(0, 213, 255, ${alpha * 0.9})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fillRect(s.x, s.y, s.size, s.size * (1.5 + s.life * 0.05));
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.15 }
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      stop();
    };
  }, [originX]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
