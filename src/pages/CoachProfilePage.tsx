import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { CoachProfileService } from "@/services/coachProfileService";
import { supabase } from "@/integrations/supabase/client";
import { FullCoachProfile } from "@/types/CoachProfile";
import CoachProfileHeader from "@/components/coach/CoachProfileHeader";
import CoachDetails from "@/components/coach/CoachDetails";
import CoachStats from "@/components/coach/CoachStats";
import PlayerCoachAchievements from "@/components/coach/PlayerCoachAchievements";
import CoachEducation from "@/components/coach/CoachEducation";
import CoachSpecialties from "@/components/coach/CoachSpecialties";
import { AnalyzedVideosList } from "@/components/profile/AnalyzedVideosList"; // Added import
import { allCoaches } from "@/data/coachesData";

const CoachProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [coachProfile, setCoachProfile] = useState<FullCoachProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load coach profile based on username parameter
  useEffect(() => {
    const loadCoachProfile = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First try to find coach in static data
        const staticCoach = allCoaches.find(coach => coach.username === username);
        
        if (staticCoach) {
          // Convert Coach to FullCoachProfile
          const fullProfile: FullCoachProfile = {
            id: String(staticCoach.id),
            user_id: String(staticCoach.id),
            years_coaching: parseInt(staticCoach.experience) || 10,
            certifications: [staticCoach.title || "Professional Coach"],
            bio: `${staticCoach.title} with ${staticCoach.experience} of coaching experience`,
            avatar_url: staticCoach.image,
            banner_url: staticCoach.image,
            specialties: staticCoach.specialties.map(s => ({
              id: Math.random().toString(),
              specialty_type_id: Math.random().toString(),
              proficiency: 'expert' as const,
              years_experience: 10
            })),
            achievements: (staticCoach.achievements || []).map(a => ({
              id: Math.random().toString(),
              title: a.title,
              description: a.description,
              year: parseInt(a.year) || new Date().getFullYear(),
              organization: '',
              achievement_type: 'coaching' as const
            })),
            education: [],
            languages: ["English"],
            rate_per_hour: 50,
            availability_status: "available" as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            currency: 'USD',
            coaching_philosophy: `Expert ${staticCoach.title} with ${staticCoach.experience} experience`,
            profile: {
              user_id: String(staticCoach.id),
              display_name: staticCoach.name,
              username: staticCoach.username,
              avatar_url: staticCoach.image,
              profile_image: staticCoach.image,
              bio: `${staticCoach.title} with ${staticCoach.experience} of coaching experience`,
              location: '',
              playing_experience: staticCoach.experience,
              preferred_play_style: '',
            },
            statistics: {
              id: Math.random().toString(),
              total_sessions: staticCoach.reviews * 2,
              total_students: staticCoach.reviews,
              average_rating: staticCoach.rating,
              total_reviews: staticCoach.reviews,
              response_time_hours: 24,
              success_rate: 0.95,
              updated_at: new Date().toISOString(),
            },
          };
          
          setCoachProfile(fullProfile);
          setLoading(false);
          return;
        }

        // If not in static data, try database
        const { data: coachData, error: coachError } = await supabase
          .from('coach_profiles')
          .select('*')
          .eq('id', username)
          .maybeSingle();

        if (coachError) {
          console.error("Error fetching coach by username:", coachError);
          setLoading(false);
          return;
        }

        if (!coachData) {
          console.error("No coach found for username:", username);
          setLoading(false);
          return;
        }

        // Set the coach profile directly
        setCoachProfile(coachData as FullCoachProfile);
      } catch (error) {
        console.error("Error loading coach profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCoachProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!coachProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Coach profile not found</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if current user is viewing their own profile
  const isOwnProfile = user?.id === coachProfile.user_id;

  // Create legacy experience object for backward compatibility
  const legacyExperience = {
    yearsPlaying: parseInt(coachProfile.profile.playing_experience?.split(' ')[0] || '0'),
    yearsCoaching: coachProfile.years_coaching,
    analysisCompleted: coachProfile.statistics?.total_sessions || 0,
    activePlayers: coachProfile.statistics?.total_students || 0,
  };

  // Transform coach profile to legacy format for components
  const legacyCoach = {
    name: coachProfile.profile.display_name || 'Coach',
    username: coachProfile.profile.username || 'unknown',
    profileImage: coachProfile.profile.profile_image || coachProfile.profile.avatar_url || '/placeholder.svg',
    specialties: coachProfile.specialties?.map(s => ({
      name: s.specialty_type?.name || '',
      proficiency: s.proficiency
    })) || [],
  };

  // Transform achievements by type
  const playerAchievements = coachProfile.achievements?.filter(a => a.achievement_type === 'playing') || [];
  const coachAchievements = coachProfile.achievements?.filter(a => a.achievement_type === 'coaching') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coach Profile Header */}
          <div className="lg:col-span-1">
            <CoachProfileHeader
              coach={legacyCoach}
              isEditing={false}
              previewImage={null}
              handleEdit={() => {}}
              handleCancel={() => {}}
              handleSave={() => {}}
              handleImageUpload={() => {}}
            />
          </div>

          {/* Coach Profile Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto">
                <TabsTrigger value="details" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Details</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Stats</TabsTrigger>
                <TabsTrigger value="achievements" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Achievements</TabsTrigger>
                <TabsTrigger value="education" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Education</TabsTrigger>
                <TabsTrigger value="specialties" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Specialties</TabsTrigger>
                <TabsTrigger value="videos" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Videos</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <CoachDetails
                  coach={{
                    id: parseInt(coachProfile.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
                    name: coachProfile.profile.display_name || 'Coach',
                    image: coachProfile.profile.profile_image || coachProfile.profile.avatar_url || '/placeholder.svg',
                    title: 'Table Tennis Coach',
                    rating: coachProfile.statistics?.average_rating || 4.5,
                    reviews: coachProfile.statistics?.total_reviews || 0,
                    responseTime: `${coachProfile.statistics?.response_time_hours || 24} hours`,
                    specialties: coachProfile.specialties?.map(s => s.specialty_type?.name).filter(Boolean) || [],
                    experience: `${coachProfile.years_coaching}+ years`,
                    category: 'professional',
                    achievements: (coachProfile.achievements || []).map(a => ({
                      year: a.year?.toString() || '',
                      title: a.title,
                      description: a.description || '',
                    })),
                  }}
                  isEditing={false}
                  editedCoach={null}
                  handleChange={() => {}}
                  handleSave={() => {}}
                  handleCancel={() => {}}
                />
              </TabsContent>

              <TabsContent value="stats">
                <CoachStats
                  experience={legacyExperience}
                  isEditing={false} // Stats are read-only
                  editedExperience={legacyExperience}
                  handleChange={() => {}} // No-op since read-only
                />
              </TabsContent>

              <TabsContent value="achievements">
                <PlayerCoachAchievements
                  playerAchievements={playerAchievements}
                  coachAchievements={coachAchievements}
                  isEditing={false}
                  onAddPlayerAchievement={() => {}}
                  onUpdatePlayerAchievement={() => {}}
                  onRemovePlayerAchievement={() => {}}
                  onAddCoachAchievement={() => {}}
                  onUpdateCoachAchievement={() => {}}
                  onRemoveCoachAchievement={() => {}}
                />
              </TabsContent>

              <TabsContent value="education">
                <CoachEducation
                  education={coachProfile.education || []}
                  isEditing={false}
                  onAdd={() => {}}
                  onUpdate={() => {}}
                  onRemove={() => {}}
                />
              </TabsContent>
              

              <TabsContent value="specialties">
                <CoachSpecialties
                  specialties={coachProfile.specialties || []}
                  isEditing={false}
                  onAdd={() => {}}
                  onUpdate={() => {}}
                  onRemove={() => {}}
                />
              </TabsContent>

              <TabsContent value="videos">
                <AnalyzedVideosList coachId={coachProfile.user_id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoachProfilePage;