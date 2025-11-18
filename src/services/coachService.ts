import { supabase } from "@/integrations/supabase/client";
import { Coach, Achievement } from "@/types/Coach";

export interface CoachProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  profile_image: string | null;
  bio: string | null;
  location: string | null;
  playing_experience: string | null;
  preferred_play_style: string | null;
}

// Static defaults for fields not available in database
const getStaticCoachData = (index: number) => ({
  rating: 4.5 + (index % 10) * 0.05, // Varying ratings between 4.5-4.95
  reviews: 50 + (index * 13) % 200, // Varying review counts
  responseTime: index % 2 === 0 ? "Within 2 hours" : "Within 4 hours",
  category: index % 3 === 0 ? "elite" : index % 3 === 1 ? "professional" : "certified",
  achievements: [
    {
      year: "2023",
      title: "Certified Table Tennis Coach",
      description: "Professional coaching certification"
    }
  ] as Achievement[]
});

// Static specialties based on play style or defaults
const getSpecialties = (playStyle: string | null, bio: string | null): string[] => {
  const specialties: string[] = [];
  
  if (playStyle) {
    specialties.push(playStyle);
  }
  
  if (bio?.toLowerCase().includes("forehand")) {
    specialties.push("Forehand Technique");
  }
  if (bio?.toLowerCase().includes("backhand")) {
    specialties.push("Backhand Technique");
  }
  if (bio?.toLowerCase().includes("serve")) {
    specialties.push("Serve Technique");
  }
  if (bio?.toLowerCase().includes("spin")) {
    specialties.push("Spin Techniques");
  }
  
  // Default specialties if none found
  if (specialties.length === 0) {
    specialties.push("General Coaching", "Technique Analysis");
  }
  
  return specialties.slice(0, 3); // Limit to 3 specialties
};

export const CoachService = {
  async getCoaches(): Promise<Coach[]> {
    try {
      // Get all coach profiles with their basic profile information
      const { data: coachProfiles, error } = await supabase
        .from('coach_profiles')
        .select(`
          *,
          profiles (
            user_id,
            username,
            display_name,
            avatar_url,
            profile_image,
            bio,
            location,
            playing_experience,
            preferred_play_style
          ),
          coach_specialties (
            id,
            proficiency,
            specialty_types (
              name
            )
          ),
          coach_statistics (
            average_rating,
            total_reviews,
            response_time_hours
          )
        `);

      if (error) {
        console.error("Error fetching coaches:", error);
        return [];
      }

      if (!coachProfiles || coachProfiles.length === 0) {
        return [];
      }

      // Transform database data to Coach interface
      const coaches: Coach[] = coachProfiles.map((coachProfile, index) => {
        const profile = coachProfile.profiles;
        const staticData = getStaticCoachData(index);
        
        return {
          id: parseInt(coachProfile.id.replace(/-/g, '').substring(0, 8), 16),
          name: profile?.display_name || "Coach",
          username: profile?.username || `coach_${coachProfile.id.slice(0, 8)}`,
          image: profile?.profile_image || profile?.avatar_url || "/placeholder.svg",
          title: `Professional Table Tennis Coach`,
          experience: profile?.playing_experience || "5+ years of experience",
          specialties: (coachProfile.coach_specialties || []).map((s: any) => 
            s.specialty_types?.name || 'General Coaching'
          ).slice(0, 3),
          rating: coachProfile.coach_statistics?.average_rating || staticData.rating,
          reviews: coachProfile.coach_statistics?.total_reviews || staticData.reviews,
          responseTime: coachProfile.coach_statistics?.response_time_hours 
            ? `Within ${coachProfile.coach_statistics.response_time_hours} hours`
            : staticData.responseTime,
          category: staticData.category,
          achievements: staticData.achievements
        };
      });

      return coaches;
    } catch (error) {
      console.error("Error in getCoaches:", error);
      return [];
    }
  }
};