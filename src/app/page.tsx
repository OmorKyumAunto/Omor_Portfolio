import type { Metadata } from "next";
import { Hero } from "@/sections/hero";
import { Trust } from "@/sections/trust";
import { About } from "@/sections/about";
import { Expertise } from "@/sections/expertise";
import { Work } from "@/sections/work";
import { ProjectFit } from "@/sections/project-fit";
import { Multilingual } from "@/sections/multilingual";
import { Capabilities } from "@/sections/capabilities";
import { AiIntegration } from "@/sections/ai";
import { Services } from "@/sections/services";
import { Process } from "@/sections/process";
import { Testimonials } from "@/sections/testimonials";
import { Contact } from "@/sections/contact";
import { SectionRule } from "@/components/ui/section";
import { resumeAvailable } from "@/lib/assets.server";
import { isAiEnabled } from "@/lib/ai/provider";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Homepage order follows the conversion path:
 * proof of work → AI analyses the visitor's requirement → how I can help →
 * direct contact.
 */
export default function HomePage() {
  return (
    <>
      <Hero resumeAvailable={resumeAvailable()} />
      <Trust />
      <About />
      <SectionRule />
      <Expertise />
      <Work />
      {/* Placed straight after the work: the visitor has seen the proof, so the
          analyzer now has something to compare their requirement against. */}
      {isAiEnabled() ? <ProjectFit /> : null}
      <Multilingual />
      <Capabilities />
      <AiIntegration />
      <Services />
      <SectionRule />
      <Process />
      <Testimonials />
      <Contact />
    </>
  );
}
