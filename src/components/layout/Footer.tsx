import { HiOutlineArrowUpRight, HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import { company, services } from "@/data/content";

export default function Footer() {
  return (
    <footer id="contact-footer" className="relative border-t border-border bg-surface">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_2px_rgba(0,213,255,0.8)]" />
              </span>
              <span className="font-display text-base font-semibold tracking-wide">
                AR <span className="text-text-secondary">HYDRAULICS</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              {company.description}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Services</h4>
            <ul className="flex flex-col gap-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a
                    href={`#services`}
                    className="text-sm text-text-secondary transition-colors hover:text-text"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Navigate</h4>
            <ul className="flex flex-col gap-2.5">
              {["Services", "Process", "Excellence", "Testimonials", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-sm text-text-secondary transition-colors hover:text-text"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="shrink-0 text-primary" /> {company.phone}
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineEnvelope className="shrink-0 text-primary" /> {company.email}
              </li>
              <li className="flex items-start gap-2">
                <HiOutlineMapPin className="mt-0.5 shrink-0 text-primary" /> {company.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-text-secondary">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <a
            href="#top"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-primary"
          >
            Back to top
            <HiOutlineArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
