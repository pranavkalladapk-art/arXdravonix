"use client";

import {
  TbTool,
  TbCylinder,
  TbDroplet,
  TbEngine,
  TbCircleDot,
  TbWind,
  TbSettings,
  TbFlame,
  TbBuildingWarehouse,
} from "react-icons/tb";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/data/content";
import { cn } from "@/lib/utils";

const icons = [
  TbTool,
  TbCylinder,
  TbDroplet,
  TbEngine,
  TbCircleDot,
  TbWind,
  TbSettings,
  TbFlame,
  TbBuildingWarehouse,
];

export default function ServicesGrid() {
  return (
    <section id="services" className="relative bg-bg py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          kicker="What We Do"
          title="Nine disciplines. One standard of precision."
          description="From full hydraulic system repair to industrial roofing, every service is executed with engineering-grade rigor and a finish that speaks for itself."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[i];
            const featured = i === 0;
            return (
              <Reveal
                key={service.id}
                delay={(i % 3) * 0.08}
                className={cn(featured && "sm:col-span-2 lg:col-span-2 lg:row-span-2")}
              >
                <GlassCard className={cn("h-full", featured && "lg:p-10")}>
                  <div className="flex h-full flex-col justify-between gap-8">
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary",
                          featured ? "h-16 w-16 text-3xl" : "h-12 w-12 text-xl"
                        )}
                      >
                        <Icon />
                      </span>
                      <span className="font-mono text-xs text-text-secondary">
                        {service.index}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <h3
                        className={cn(
                          "font-display font-medium tracking-tight text-text",
                          featured ? "text-3xl sm:text-4xl" : "text-xl"
                        )}
                      >
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {featured ? service.description : service.short}
                      </p>

                      {featured && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {service.points.map((p) => (
                            <li
                              key={p}
                              className="rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-secondary"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Learn more
                      <HiOutlineArrowUpRight />
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
