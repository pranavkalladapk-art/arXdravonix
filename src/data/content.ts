export const company = {
  name: "AR Hydraulics and Sealing Solutions",
  shortName: "AR Hydraulics",
  tagline: "Precision Engineered. Built to Endure.",
  description:
    "AR Hydraulics and Sealing Solutions is a leading industrial engineering company specializing in hydraulic repair services, precision engineering, sealing solutions, fabrication, machining, and industrial roofing works.",
  phone: "+91 98765 43210",
  email: "info@arhydraulics.com",
  address: "Industrial Estate, Manufacturing District",
};

export interface Service {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  points: string[];
}

export const services: Service[] = [
  {
    id: "hydraulic-repair",
    index: "01",
    title: "Hydraulic Repair Service",
    short: "Full-system diagnostics and restoration",
    description:
      "End-to-end hydraulic system repair — from failure diagnosis to complete restoration. Our engineers strip, inspect, and rebuild hydraulic assemblies to original performance specifications, minimizing downtime for critical machinery.",
    points: ["Failure diagnostics", "On-site & workshop repair", "Performance testing"],
  },
  {
    id: "cylinder-repair",
    index: "02",
    title: "Hydraulic Cylinder Repair",
    short: "Precision piston & rod restoration",
    description:
      "Complete hydraulic cylinder overhaul including rod re-chroming, honing, seal replacement, and piston assembly rebuilding — engineered to restore full hydraulic force and eliminate leakage.",
    points: ["Rod re-chroming & honing", "Piston assembly rebuild", "Pressure & leak testing"],
  },
  {
    id: "pumps",
    index: "03",
    title: "Hydraulic Pumps",
    short: "Repair, rebuild & performance tuning",
    description:
      "Specialist repair and reconditioning of gear, vane, and piston pumps. We restore volumetric efficiency and eliminate cavitation issues, returning pumps to peak operating pressure.",
    points: ["Gear, vane & piston pumps", "Volumetric efficiency testing", "Flow & pressure calibration"],
  },
  {
    id: "motors",
    index: "04",
    title: "Hydraulic Motors",
    short: "Rotary power, rebuilt for torque",
    description:
      "Precision rebuilding of hydraulic motors for maximum torque output and rotational efficiency, with full internal component inspection and dynamic performance verification.",
    points: ["Internal component inspection", "Torque & RPM verification", "Rotary seal replacement"],
  },
  {
    id: "hydraulic-seals",
    index: "05",
    title: "Hydraulic Seals",
    short: "Zero-leak sealing engineering",
    description:
      "Custom-engineered hydraulic seals designed for extreme pressure environments. We source and manufacture seal kits matched precisely to OEM tolerances for a permanent, leak-free fit.",
    points: ["Custom seal kits", "High-pressure compounds", "OEM-spec tolerances"],
  },
  {
    id: "pneumatic-seals",
    index: "06",
    title: "Pneumatic Seals",
    short: "Air-tight precision sealing",
    description:
      "Pneumatic sealing solutions engineered for consistent air pressure retention, reduced friction, and extended cycle life across industrial pneumatic systems.",
    points: ["Low-friction compounds", "Air pressure retention", "Extended cycle life"],
  },
  {
    id: "machining",
    index: "07",
    title: "Precision Machining Jobs",
    short: "CNC precision to micron tolerance",
    description:
      "Advanced CNC machining services for complex industrial components, delivering tight tolerances, superior surface finishes, and repeatable precision at scale.",
    points: ["CNC turning & milling", "Micron-level tolerances", "Prototype to production runs"],
  },
  {
    id: "fabrication",
    index: "08",
    title: "Metal Fabrication",
    short: "Structural steel & custom assemblies",
    description:
      "Full-scale metal fabrication from concept to completion — cutting, welding, and assembling structural steel components engineered for industrial strength and longevity.",
    points: ["Custom steel fabrication", "Certified welding", "Structural assembly"],
  },
  {
    id: "roofing",
    index: "09",
    title: "Industrial Roofing Works",
    short: "Large-scale steel roofing systems",
    description:
      "Design, fabrication, and installation of industrial roofing systems built for durability, weatherproofing, and long-term structural performance across large-scale facilities.",
    points: ["Steel roofing systems", "Weatherproof installation", "Large-scale facility coverage"],
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 20, suffix: "+", label: "Years of Engineering Excellence" },
  { value: 5000, suffix: "+", label: "Hydraulic Systems Restored" },
  { value: 98, suffix: "%", label: "On-Time Project Delivery" },
  { value: 24, suffix: "/7", label: "Emergency Repair Support" },
];

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Diagnosis",
    description:
      "Comprehensive inspection and failure analysis to identify root causes with precision instrumentation.",
  },
  {
    index: "02",
    title: "Engineering",
    description:
      "Custom repair and fabrication plans engineered to OEM tolerances and site-specific requirements.",
  },
  {
    index: "03",
    title: "Precision Build",
    description:
      "Machining, sealing, and assembly executed in a controlled workshop environment with rigorous QA.",
  },
  {
    index: "04",
    title: "Testing",
    description:
      "Full pressure, flow, and load testing to verify performance before deployment.",
  },
  {
    index: "05",
    title: "Deployment",
    description:
      "On-site installation and commissioning with ongoing support and maintenance planning.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "AR Hydraulics rebuilt our entire press line hydraulics in record time. The precision and attention to detail was on another level.",
    name: "Rajesh Menon",
    role: "Plant Manager",
    company: "Precision Forge Industries",
  },
  {
    quote:
      "Their sealing solutions eliminated leaks we had been fighting for years. True engineering craftsmanship.",
    name: "Ananya Iyer",
    role: "Maintenance Head",
    company: "Coastal Manufacturing Co.",
  },
  {
    quote:
      "From machining to fabrication, AR Hydraulics delivers industrial work with a level of finish you rarely see.",
    name: "Vikram Shetty",
    role: "Operations Director",
    company: "Shetty Steel Works",
  },
];
