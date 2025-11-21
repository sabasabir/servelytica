
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedCoachesSection from "@/components/home/FeaturedCoachesSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
    const { user } = useAuth();

  return (
    <>
        <div>
        <Navbar />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <FeaturedCoachesSection />
          <BenefitsSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
        </div>
    </>
  );
};

export default Index;
