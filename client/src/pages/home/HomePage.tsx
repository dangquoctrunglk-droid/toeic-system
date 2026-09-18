import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from "./components";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col selection:bg-indigo-500 selection:text-white">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
