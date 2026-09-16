import { Navbar, Footer } from '../../components/common';
import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from './components';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080d1c] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
