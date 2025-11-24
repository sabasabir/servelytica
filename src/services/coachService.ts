import { supabase } from "@/integrations/supabase/client";
import { Coach, Achievement } from "@/types/Coach";
import { allCoaches } from "@/data/coachesData";

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
  rating: 4.5 + (index % 10) * 0.05,
  reviews: 50 + (index * 13) % 200,
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
  
  if (specialties.length === 0) {
    specialties.push("General Coaching", "Technique Analysis");
  }
  
  return specialties.slice(0, 3);
};

export const CoachService = {
  async getCoaches(limit: number = 15): Promise<Coach[]> {
    try {
      // Use API endpoint for coaches
      const response = await fetch(`/api/coaches?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch coaches');
      
      const coachProfiles = await response.json();

      if (!coachProfiles || coachProfiles.length === 0) {
        return allCoaches || [];
      }

      // Transform database data to Coach interface
      const coaches: Coach[] = coachProfiles.map((coachProfile: any, index: number) => {
        const staticData = getStaticCoachData(index);
        
        return {
          id: parseInt((coachProfile.id || index).toString().replace(/-/g, '').substring(0, 8), 16) || index,
          name: coachProfile.coachingPhilosophy ? `Coach ${index + 1}` : "Coach",
          username: `coach_${coachProfile.id?.slice(0, 8) || index}`,
          image: "/placeholder.svg",
          title: `Professional Table Tennis Coach`,
          experience: `${coachProfile.yearsCoaching || 5}+ years of experience`,
          specialties: coachProfile.certifications?.slice(0, 3) || ['General Coaching', 'Technique Analysis'],
          rating: staticData.rating,
          reviews: staticData.reviews,
          responseTime: staticData.responseTime,
          category: staticData.category,
          achievements: staticData.achievements,
          ...(coachProfile as any)
        };
      });

      return coaches;
    } catch (error) {
      console.error("Error in getCoaches:", error);
      return allCoaches || [];
    }
  },

  async getCoachById(coachId: string): Promise<Coach | null> {
    try {
      const response = await fetch(`/api/coaches/${coachId}`);
      if (!response.ok) throw new Error('Failed to fetch coach');
      const coachProfile = await response.json();

      if (!coachProfile) return null;

      return {
        id: parseInt((coachProfile.id || '').toString().replace(/-/g, '').substring(0, 8), 16),
        name: `Coach ${coachId}`,
        username: `coach_${coachProfile.id?.slice(0, 8)}`,
        image: "/placeholder.svg",
        title: `Professional Table Tennis Coach`,
        experience: `${coachProfile.yearsCoaching || 5}+ years of experience`,
        specialties: coachProfile.certifications?.slice(0, 3) || ['General Coaching'],
        rating: 4.8,
        reviews: 50,
        responseTime: "Within 24 hours",
        category: "professional",
        achievements: [],
        ...coachProfile
      };
    } catch (error) {
      console.error("Error fetching coach:", error);
      return null;
    }
  },

  async createCoachProfile(data: any): Promise<any> {
    try {
      const response = await fetch('/api/coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create coach profile');
      return await response.json();
    } catch (error) {
      console.error("Error creating coach profile:", error);
      throw error;
    }
  },

  async updateCoachProfile(userId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`/api/coaches/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update coach profile');
      return await response.json();
    } catch (error) {
      console.error("Error updating coach profile:", error);
      throw error;
    }
  },

  async deleteCoachProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(`/api/coaches/profile/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete coach profile');
      return await response.json();
    } catch (error) {
      console.error("Error deleting coach profile:", error);
      throw error;
    }
  },

  async searchCoaches(query: string, limit: number = 50): Promise<Coach[]> {
    try {
      const response = await fetch(`/api/coaches/search/${encodeURIComponent(query)}?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to search coaches');
      
      const coachProfiles = await response.json();
      return coachProfiles.map((coach: any, index: number) => ({
        id: index,
        name: `Coach ${index + 1}`,
        username: `coach_${index}`,
        image: "/placeholder.svg",
        title: "Professional Table Tennis Coach",
        experience: `${coach.yearsCoaching || 5}+ years`,
        specialties: coach.certifications?.slice(0, 3) || ['Coaching'],
        rating: 4.8,
        reviews: 50,
        responseTime: "Within 24 hours",
        category: "professional",
        achievements: [],
        ...coach
      }));
    } catch (error) {
      console.error("Error searching coaches:", error);
      return [];
    }
  },
};
