export interface SpecialtyType {
  id: string;
  name: string;
  description?: string;
}

export interface FocusArea {
  id: string;
  name: string;
  description?: string;
}

export interface CoachSpecialty {
  id: string;
  specialty_type_id: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience: number;
  specialty_type?: SpecialtyType;
}

export interface CoachAchievement {
  id: string;
  title: string;
  description?: string;
  year?: number;
  organization?: string;
  achievement_type: 'playing' | 'coaching';
}

export interface CoachEducation {
  id: string;
  degree: string;
  institution: string;
  year_completed?: number;
  field_of_study?: string;
}

export interface CoachStatistics {
  id: string;
  total_sessions: number;
  total_students: number;
  average_rating: number;
  total_reviews: number;
  response_time_hours: number;
  success_rate: number;
  updated_at: string;
}

// Legacy type for backwards compatibility
export interface CoachExperience {
  yearsPlaying: number;
  yearsCoaching: number;
  analysisCompleted: number;
  activePlayers: number;
}

export interface CoachProfile {
  id: string;
  user_id: string;
  years_coaching: number;
  certifications: string[];
  languages: string[];
  coaching_philosophy?: string;
  rate_per_hour?: number;
  currency: string;
  availability_schedule?: any;
  verified: boolean;
  created_at: string;
  updated_at: string;
  specialties?: CoachSpecialty[];
  achievements?: CoachAchievement[];
  education?: CoachEducation[];
  statistics?: CoachStatistics;
}

export interface FullCoachProfile extends CoachProfile {
  profile: {
    display_name: string;
    username: string;
    avatar_url?: string;
    profile_image?: string;
    bio?: string;
    location?: string;
    playing_experience?: string;
    preferred_play_style?: string;
  };
}