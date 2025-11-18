
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedCoachesSection from "@/components/home/FeaturedCoachesSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import SurvayModal from "@/components/SurvayModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
    const { user, userProfile, userRoles} = useAuth();

    console.log({user, userProfile, userRoles})
    console.log('Index component rendering - all sections should be visible');

    const handleCompletedSurvey = async () => {
        const {error} = await supabase.from('user_roles').update({is_survey_completed: true}).eq('user_id', userProfile?.id).single();
        if (error) {
            console.error('Error updating survey completed:', error);
        }
    }
  return (
    <>
        <div className={`${userRoles?.role === 'player' && userRoles?.is_survey_completed === false ? 'cursor-not-allowed' : ''}`}>
        <Navbar />
        <main style={{ minHeight: 'auto' }}>
          <HeroSection />
          <HowItWorksSection />
          <div style={{ backgroundColor: 'red', padding: '50px', color: 'white', fontSize: '24px', minHeight: '200px' }}>
            <h2>TESTING: This div should be visible after HowItWorksSection</h2>
            <p>If you can see this red section, then there's no rendering issue with adding new divs</p>
          </div>
          {/* Now let's uncomment one section at a time */}
          <FeaturedCoachesSection />
          {/* <BenefitsSection /> */}
          {/* <TestimonialsSection /> */}
          {/* <CTASection /> */}
        </main>
        <Footer />
        </div>
        {(userRoles?.role === 'player' && !userRoles?.is_survey_completed) && <SurvayModal userId={userProfile?.id} onComplete={handleCompletedSurvey} />}
    </>
  );
};

export default Index;
