
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

    const handleCompletedSurvey = async () => {
        const {error} = await supabase.from('user_roles').update({is_survey_completed: true}).eq('user_id', userProfile?.id).single();
        if (error) {
            console.error('Error updating survey completed:', error);
        }
    }
  return (
    <>
        <div className={`min-h-screen flex flex-col ${userRoles?.role === 'player' && userRoles?.is_survey_completed === false ? 'cursor-not-allowed  ' : ''}`}>
        <Navbar />
        <HeroSection />
        <HowItWorksSection />
        <FeaturedCoachesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
        </div>
        {(userRoles?.role === 'player' && !userRoles?.is_survey_completed) && <SurvayModal userId={userProfile?.id} onComplete={handleCompletedSurvey} />}
    </>
  );
};

export default Index;
