"use client";

import { useState } from "react";
import { HiOutlineArrowUpRight, HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import { company } from "@/data/content";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/8 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          kicker="Get In Touch"
          title="Let's engineer your next solution."
          description="Whether it's an emergency hydraulic failure or a full fabrication project, our engineering team is ready to respond."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="glass border-glow relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 sm:p-10">
              <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-25" />

              {/* Animated locator */}
              <div className="relative z-10 flex h-56 items-center justify-center">
                <span className="absolute h-40 w-40 animate-ping rounded-full border border-primary/30" />
                <span className="absolute h-28 w-28 rounded-full border border-primary/20" />
                <span className="absolute h-16 w-16 rounded-full border border-primary/30 bg-primary/5" />
                <span className="relative h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_6px_rgba(0,213,255,0.7)]" />
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="group flex items-center justify-between border-b border-border pb-4 text-text transition-colors hover:text-primary">
                  <span className="flex items-center gap-3 text-sm">
                    <HiOutlinePhone className="text-primary" /> {company.phone}
                  </span>
                  <HiOutlineArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a href={`mailto:${company.email}`} className="group flex items-center justify-between border-b border-border pb-4 text-text transition-colors hover:text-primary">
                  <span className="flex items-center gap-3 text-sm">
                    <HiOutlineEnvelope className="text-primary" /> {company.email}
                  </span>
                  <HiOutlineArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <HiOutlineMapPin className="text-primary" /> {company.address}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="glass border-glow flex h-full flex-col gap-5 rounded-3xl p-8 sm:p-10"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="John Doe" />
                <Field label="Phone" name="phone" placeholder="+91 00000 00000" type="tel" />
              </div>
              <Field label="Email" name="email" placeholder="you@company.com" type="email" />
              <Field
                label="Project Details"
                name="message"
                placeholder="Tell us about your hydraulic, sealing, or fabrication requirement..."
                textarea
              />

              <MagneticButton>
                {submitted ? "Request Sent" : "Send Request"}
                <HiOutlineArrowUpRight />
              </MagneticButton>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={4}
          required
          className="resize-none rounded-2xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary/50"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required
          className="rounded-2xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary/50"
        />
      )}
    </label>
  );
}
