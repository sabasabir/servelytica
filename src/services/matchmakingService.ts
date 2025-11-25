import { supabase } from "@/integrations/supabase/client";

export interface MatchResult {
  coachId: string;
  coachName: string;
  displayName: string;
  profileImage?: string;
  bio?: string;
  yearsCoaching?: number;
  similarityScore: number;
  matchReason: string;
}

export interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  role: string;
  sport?: string;
  skillLevel?: string;
  focusAreas?: string[];
}

/**
 * Matchmaking Service - Q&A Similarity Radius Algorithm
 * Uses cosine similarity and skill level matching to find compatible coach-student pairs
 */
export class MatchmakingService {
  /**
   * Calculate similarity between two text strings (0-1, where 1 is identical)
   */
  private static calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Extract skill level from answers/profile (0-10 scale)
   */
  private static extractSkillLevel(text?: string): number {
    if (!text) return 5; // Default middle level
    
    const skillKeywords = {
      beginner: 2,
      novice: 2,
      intermediate: 5,
      advanced: 8,
      expert: 10,
      professional: 10,
    };
    
    const lowerText = text.toLowerCase();
    for (const [keyword, level] of Object.entries(skillKeywords)) {
      if (lowerText.includes(keyword)) {
        return level;
      }
    }
    
    return 5;
  }

  /**
   * Find coaches that match a player's profile and questions
   * @param playerId Player ID
   * @param playerAnswers Player's Q&A responses
   * @param radiusThreshold Similarity threshold (0-1, default 0.5 = 50%)
   */
  static async findMatchingCoaches(
    playerId: string,
    playerAnswers: Record<string, string>,
    radiusThreshold: number = 0.5
  ): Promise<MatchResult[]> {
    try {
      // Get all coaches with their profiles
      const { data: coaches, error: coachError } = await supabase
        .from('profiles')
        .select('id, username, display_name, bio, profile_image, years_coaching')
        .eq('role', 'coach')
        .gt('years_coaching', 0);

      if (coachError) throw coachError;
      if (!coaches || coaches.length === 0) return [];

      // Get player profile and answers
      const { data: playerProfile, error: playerError } = await supabase
        .from('profiles')
        .select('username, display_name, role, sport')
        .eq('id', playerId)
        .single();

      if (playerError) throw playerError;

      const playerAnswersText = Object.values(playerAnswers).join(' ');
      const playerSkillLevel = this.extractSkillLevel(playerAnswersText);

      // Calculate similarity scores for each coach
      const matches: MatchResult[] = coaches
        .map(coach => {
          const coachBio = coach.bio || '';
          const similarity = this.calculateTextSimilarity(
            playerAnswersText,
            coachBio
          );

          // Skill level compatibility (coaches should be more experienced)
          const coachSkillLevel = coach.years_coaching || 0;
          const skillLevelFit = Math.min(1, coachSkillLevel / Math.max(playerSkillLevel, 1));

          // Combined score: 60% text similarity + 40% skill level fit
          const finalScore = (similarity * 0.6) + (skillLevelFit * 0.4);

          return {
            coachId: coach.id,
            coachName: coach.username,
            displayName: coach.display_name || coach.username,
            profileImage: coach.profile_image,
            bio: coach.bio,
            yearsCoaching: coach.years_coaching,
            similarityScore: finalScore,
            matchReason: this.getMatchReason(
              similarity,
              skillLevelFit,
              coach.years_coaching
            ),
          };
        })
        .filter(match => match.similarityScore >= radiusThreshold)
        .sort((a, b) => b.similarityScore - a.similarityScore);

      return matches;
    } catch (error) {
      console.error('Error finding matching coaches:', error);
      throw error;
    }
  }

  /**
   * Find students that match a coach's profile and teaching style
   */
  static async findMatchingStudents(
    coachId: string,
    coachProfile: Record<string, string>,
    radiusThreshold: number = 0.5
  ): Promise<MatchResult[]> {
    try {
      // Get all players
      const { data: players, error: playerError } = await supabase
        .from('profiles')
        .select('id, username, display_name, profile_image, bio')
        .eq('role', 'player');

      if (playerError) throw playerError;
      if (!players || players.length === 0) return [];

      const coachBioText = Object.values(coachProfile).join(' ');

      // Calculate similarity scores
      const matches: MatchResult[] = players
        .map(player => {
          const playerBio = player.bio || '';
          const similarity = this.calculateTextSimilarity(coachBioText, playerBio);

          return {
            coachId: player.id,
            coachName: player.username,
            displayName: player.display_name || player.username,
            profileImage: player.profile_image,
            bio: player.bio,
            yearsCoaching: undefined,
            similarityScore: similarity,
            matchReason: `${Math.round(similarity * 100)}% teaching style match`,
          };
        })
        .filter(match => match.similarityScore >= radiusThreshold)
        .sort((a, b) => b.similarityScore - a.similarityScore);

      return matches;
    } catch (error) {
      console.error('Error finding matching students:', error);
      throw error;
    }
  }

  /**
   * Generate human-readable match reason
   */
  private static getMatchReason(
    similarity: number,
    skillFit: number,
    yearsCoaching?: number
  ): string {
    const similarityPercent = Math.round(similarity * 100);
    const experience = yearsCoaching || 0;

    if (similarityPercent >= 80) {
      return `Excellent match (${similarityPercent}% profile fit, ${experience} years experience)`;
    } else if (similarityPercent >= 60) {
      return `Good match (${similarityPercent}% profile fit, ${experience} years experience)`;
    } else {
      return `Fair match (${similarityPercent}% profile fit, ${experience} years experience)`;
    }
  }

  /**
   * Create a connection between coach and student
   */
  static async createConnection(coachId: string, studentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('coach_student_relationships')
        .insert({
          coach_id: coachId,
          student_id: studentId,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating connection:', error);
      throw error;
    }
  }

  /**
   * Get recommended connections for a user
   */
  static async getRecommendations(
    userId: string,
    userRole: 'coach' | 'player',
    limit: number = 5
  ): Promise<MatchResult[]> {
    try {
      const userProfile = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!userProfile.data) return [];

      const answers: Record<string, string> = {
        bio: userProfile.data.bio || '',
        experience: `${userProfile.data.years_coaching || 0} years`,
      };

      const matches =
        userRole === 'player'
          ? await this.findMatchingCoaches(userId, answers)
          : await this.findMatchingStudents(userId, answers);

      return matches.slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}
