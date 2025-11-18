
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorksSection from "@/components/home/HowItWorksSection";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-8">
        <HowItWorksSection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
