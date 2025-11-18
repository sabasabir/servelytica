import { supabase } from "@/integrations/supabase/client";
import { 
  CoachProfile, 
  FullCoachProfile, 
  CoachAchievement, 
  CoachEducation, 
  CoachSpecialty,
  SpecialtyType,
  FocusArea 
} from "@/types/CoachProfile";

export const CoachProfileService = {
  // Get specialty types for dropdowns
  async getSpecialtyTypes(): Promise<SpecialtyType[]> {
    const { data, error } = await supabase
      .from('specialty_types')
      .select('*')
      .order('name');

    if (error) {
      console.error("Error fetching specialty types:", error);
      return [];
    }

    return data || [];
  },

  // Get focus areas for dropdowns
  async getFocusAreas(): Promise<FocusArea[]> {
    const { data, error } = await supabase
      .from('focus_areas')
      .select('*')
      .order('name');

    if (error) {
      console.error("Error fetching focus areas:", error);
      return [];
    }

    return data || [];
  },

  // Get full coach profile by user ID
  async getCoachProfile(userId: string): Promise<FullCoachProfile | null> {
    try {
      // Get basic profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching profile:", profileError);
        return null;
      }

      // Get coach profile
      const { data: coachProfile, error: coachError } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles

      if (coachError && coachError.code !== 'PGRST116') {
        console.error("Error fetching coach profile:", coachError);
        return null;
      }

      if (!coachProfile) {
        // No coach profile exists yet, return basic structure
        return {
          id: '',
          user_id: userId,
          years_coaching: 0,
          certifications: [],
          languages: [],
          currency: 'USD',
          verified: false,
          created_at: '',
          updated_at: '',
          profile: {
            display_name: profile.display_name || '',
            username: profile.username || '',
            avatar_url: profile.avatar_url,
            profile_image: profile.profile_image,
            bio: profile.bio,
            location: profile.location,
            playing_experience: profile.playing_experience,
            preferred_play_style: profile.preferred_play_style,
          },
          specialties: [],
          achievements: [],
          education: [],
        };
      }

      // Get specialties with specialty type names
      const { data: specialties, error: specialtiesError } = await supabase
        .from('coach_specialties')
        .select(`
          *,
          specialty_type:specialty_types(*)
        `)
        .eq('coach_profile_id', coachProfile.id);

      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('coach_achievements')
        .select('*')
        .eq('coach_profile_id', coachProfile.id)
        .order('year', { ascending: false });

      // Get education
      const { data: education, error: educationError } = await supabase
        .from('coach_education')
        .select('*')
        .eq('coach_profile_id', coachProfile.id)
        .order('year_completed', { ascending: false });

      // Get statistics
      const { data: statistics, error: statisticsError } = await supabase
        .from('coach_statistics')
        .select('*')
        .eq('coach_profile_id', coachProfile.id)
        .maybeSingle(); // Use maybeSingle for statistics too

      return {
        ...coachProfile,
        profile: {
          display_name: profile.display_name || '',
          username: profile.username || '',
          avatar_url: profile.avatar_url,
          profile_image: profile.profile_image,
          bio: profile.bio,
          location: profile.location,
          playing_experience: profile.playing_experience,
          preferred_play_style: profile.preferred_play_style,
        },
        specialties: specialties || [],
        achievements: (achievements || []).map(a => ({
          ...a,
          achievement_type: a.achievement_type as 'playing' | 'coaching'
        })),
        education: education || [],
        statistics: statistics || undefined,
      };
    } catch (error) {
      console.error("Error in getCoachProfile:", error);
      return null;
    }
  },

  // Create or update coach profile
  async upsertCoachProfile(userId: string, profileData: Partial<CoachProfile>): Promise<CoachProfile | null> {
    try {
      // First check if coach profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('coach_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing coach profile:", checkError);
        return null;
      }

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('coach_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error("Error updating coach profile:", error);
          return null;
        }

        return data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('coach_profiles')
          .insert({
            user_id: userId,
            ...profileData,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating coach profile:", error);
          return null;
        }

        return data;
      }
    } catch (error) {
      console.error("Error in upsertCoachProfile:", error);
      return null;
    }
  },

  // Manage specialties
  async addSpecialty(coachProfileId: string, specialtyTypeId: string, proficiency: string, yearsExperience: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_specialties')
        .insert({
          coach_profile_id: coachProfileId,
          specialty_type_id: specialtyTypeId,
          proficiency: proficiency as any,
          years_experience: yearsExperience,
        });

      if (error) {
        console.error("Error adding specialty:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addSpecialty:", error);
      return false;
    }
  },

  async updateSpecialty(specialtyId: string, updates: Partial<CoachSpecialty>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_specialties')
        .update(updates)
        .eq('id', specialtyId);

      if (error) {
        console.error("Error updating specialty:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateSpecialty:", error);
      return false;
    }
  },

  async removeSpecialty(specialtyId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_specialties')
        .delete()
        .eq('id', specialtyId);

      if (error) {
        console.error("Error removing specialty:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in removeSpecialty:", error);
      return false;
    }
  },

  // Manage achievements
  async addAchievement(coachProfileId: string, achievement: Omit<CoachAchievement, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_achievements')
        .insert({
          coach_profile_id: coachProfileId,
          ...achievement,
        });

      if (error) {
        console.error("Error adding achievement:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addAchievement:", error);
      return false;
    }
  },

  async updateAchievement(achievementId: string, updates: Partial<CoachAchievement>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_achievements')
        .update(updates)
        .eq('id', achievementId);

      if (error) {
        console.error("Error updating achievement:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateAchievement:", error);
      return false;
    }
  },

  async removeAchievement(achievementId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_achievements')
        .delete()
        .eq('id', achievementId);

      if (error) {
        console.error("Error removing achievement:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in removeAchievement:", error);
      return false;
    }
  },

  // Manage education
  async addEducation(coachProfileId: string, education: Omit<CoachEducation, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_education')
        .insert({
          coach_profile_id: coachProfileId,
          ...education,
        });

      if (error) {
        console.error("Error adding education:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addEducation:", error);
      return false;
    }
  },

  async updateEducation(educationId: string, updates: Partial<CoachEducation>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_education')
        .update(updates)
        .eq('id', educationId);

      if (error) {
        console.error("Error updating education:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateEducation:", error);
      return false;
    }
  },

  async removeEducation(educationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('coach_education')
        .delete()
        .eq('id', educationId);

      if (error) {
        console.error("Error removing education:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in removeEducation:", error);
      return false;
    }
  },
};