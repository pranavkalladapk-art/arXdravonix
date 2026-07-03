"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowUpRight, HiBars3, HiXMark } from "react-icons/hi2";
import { company } from "@/data/content";
import { cn } from "@/lib/utils";

const links = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Excellence", href: "#excellence" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-7 z-[999] transition-all duration-500",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 inset-y-0 bg-[#050505] transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-500 sm:px-8",
          scrolled ? "glass mx-4 py-3 sm:mx-8" : "py-2"
        )}
      >
        <a href="#top" className="flex items-center gap-2.5" onClick={(e) => { e.preventDefault(); handleNav("#top"); }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_2px_rgba(0,213,255,0.8)]" />
          </span>
          <span className="font-display text-sm font-semibold tracking-wide sm:text-base">
            AR <span className="text-text-secondary">HYDRAULICS</span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="group relative font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-text"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNav("#contact"); }}
            className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-[#050505]"
          >
            {company.phone}
            <HiOutlineArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiXMark size={20} /> : <HiBars3 size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-4 mt-3 flex flex-col gap-1 rounded-3xl border border-border bg-[#0a0a0aef] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:hidden"
          >
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="rounded-xl px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:bg-white/5 hover:text-text"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
