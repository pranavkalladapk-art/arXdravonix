import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {kicker && (
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            <span className="h-px w-8 bg-primary/60" />
            {kicker}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "font-display text-4xl font-medium leading-[1.05] tracking-tight text-text sm:text-5xl lg:text-6xl",
            titleClassName
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
