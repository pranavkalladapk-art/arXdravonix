import Hero from "@/components/sections/Hero";
import StatsAbout from "@/components/sections/StatsAbout";
import ServicesGrid from "@/components/sections/ServicesGrid";
import RepairShowcase from "@/components/sections/RepairShowcase";
import MachiningFabrication from "@/components/sections/MachiningFabrication";
import RoofingShowcase from "@/components/sections/RoofingShowcase";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsAbout />
      <ServicesGrid />
      <RepairShowcase />
      <MachiningFabrication />
      <RoofingShowcase />
      <ProcessTimeline />
      <Testimonials />
      <Contact />
    </>
  );
}
