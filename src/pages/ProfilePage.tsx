import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useCoachProfile } from "@/hooks/useCoachProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, X } from "lucide-react";
import { ProfileService, ProfileData, PerformanceMetric, VideoData } from "@/services/profileService";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileTabs from "@/components/profile/ProfileTabs";
import CoachProfileHeader from "@/components/coach/CoachProfileHeader";
import CoachDetails from "@/components/coach/CoachDetails";
import CoachStats from "@/components/coach/CoachStats";
import PlayerCoachAchievements from "@/components/coach/PlayerCoachAchievements";
import CoachEducation from "@/components/coach/CoachEducation";
import CoachSpecialties from "@/components/coach/CoachSpecialties";
import { AnalysisQuotaCard } from "@/components/profile/AnalysisQuotaCard";
import { AnalyzedVideosList } from "@/components/profile/AnalyzedVideosList";
import { PendingVideosList } from "@/components/coach/PendingVideosList";
import PlayerCoachFeedbacks from "@/components/coach/PlayerCoachFeedbacks";
import CoachReviews from "@/components/coach/CoachReviews";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<ProfileData>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  
  if (!authUser && !authLoading) {
    return <Navigate to="/auth" replace />;
  }
  const { role, loading: roleLoading } = useUserRole();

  // Coach profile management
  const {
    coachProfile,
    loading: coachLoading,
    isEditing: isCoachEditing,
    editedProfile,
    previewImage: coachPreviewImage,
    specialtyTypes,
    focusAreas,
    handleEdit: handleCoachEdit,
    handleCancel: handleCoachCancel,
    handleSave: handleCoachSave,
    handleChange: handleCoachChange,
    handleImageUpload: handleCoachImageUpload,
    handleAddSpecialty,
    handleUpdateSpecialty,
    handleRemoveSpecialty,
    handleAddAchievement,
    handleUpdateAchievement,
    handleRemoveAchievement,
    handleAddEducation,
    handleUpdateEducation,
    handleRemoveEducation,
  } = useCoachProfile();

  useEffect(() => {
    if (authUser) {
      loadProfileData();
    }
  }, [authUser]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, metrics, videosData] = await Promise.all([
        ProfileService.getCurrentUserProfile(),
        ProfileService.getPerformanceMetrics(),
        ProfileService.getUserVideos()
      ]);

      if (profileData) {
        setUser(profileData);
        setEditedUser(profileData);
      }
      setPerformanceData(metrics);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (user) {
      setEditedUser({ ...user });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    if (user) {
      setEditedUser({ ...user });
    }
  };

  const handleSave = async () => {
    try {
      const success = await ProfileService.updateProfile(editedUser);
      if (success) {
        setUser(prev => prev ? { ...prev, ...editedUser } : null);
        setIsEditing(false);
        setPreviewImage(null);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        setEditedUser(prev => ({
          ...prev,
          profile_image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Profile not found. Please try again later.</p>
        </div>
      </div>
    );
  }

  // If user is a coach, show the comprehensive coach profile interface
  if (role === 'coach') {
    if (coachLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Coach Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!coachProfile || !coachProfile.id) {
      // Show setup interface when editing or when profile doesn't exist
      if (!isCoachEditing) {
        return (
          <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-8">Coach Profile</h1>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Complete your coach profile to get started.</p>
                <Button onClick={handleCoachEdit}>Set Up Coach Profile</Button>
              </div>
            </div>
          </div>
        );
      } else {
        // Show editing interface for new profile setup using existing user data
        const existingUserData = authUser; // Get the logged-in auth user data
        
        const emptyProfile = {
          profile: {
            display_name: existingUserData?.user_metadata?.display_name || authUser?.email?.split('@')[0] || '',
            avatar_url: existingUserData?.user_metadata?.avatar_url || '',
            bio: '',
            location: '',
            playing_experience: '',
            preferred_play_style: '',
          },
          years_coaching: 0,
          coaching_philosophy: '',
          rate_per_hour: 0,
          currency: 'USD',
          certifications: [],
          languages: [],
          specialties: [],
          achievements: [],
          education: [],
          statistics: {
            average_rating: 0,
            total_reviews: 0,
            response_time_hours: 24,
            total_sessions: 0,
            total_students: 0,
            success_rate: 0,
          }
        };
        
        // Continue to render editing interface with existing user data
        const coachProfileForEditing = emptyProfile;
        const legacyExperience = {
          yearsPlaying: 0,
          yearsCoaching: 0,
          analysisCompleted: 0,
          activePlayers: 0,
        };

        const legacyCoach = {
          name: existingUserData?.user_metadata?.display_name || authUser?.email?.split('@')[0] || 'Coach',
          username: authUser?.email?.split('@')[0] || 'coach',
          profileImage: existingUserData?.user_metadata?.avatar_url || '/placeholder.svg',
          specialties: [],
        };

        return (
          <div className="min-h-screen bg-background">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Setup Coach Profile</h1>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCoachCancel} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleCoachSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Create Profile
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <CoachProfileHeader
                    coach={legacyCoach}
                    isEditing={true}
                    previewImage={coachPreviewImage}
                    handleEdit={handleCoachEdit}
                    handleCancel={handleCoachCancel}
                    handleSave={handleCoachSave}
                    handleImageUpload={handleCoachImageUpload}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="details">Personal Details</TabsTrigger>
                      <TabsTrigger value="stats">Coaching Stats</TabsTrigger>
                      <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
                      {/* <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="specialties">Specialties</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="details">
                      <CoachDetails
                        coach={{
                          id: 0,
                          name: existingUserData?.user_metadata?.display_name || authUser?.email?.split('@')[0] || 'Coach',
                          image: existingUserData?.user_metadata?.avatar_url || '/placeholder.svg',
                          title: 'Table Tennis Coach',
                          rating: 0,
                          reviews: 0,
                          responseTime: '24 hours',
                          specialties: [],
                          experience: '0+ years',
                          category: 'professional',
                          achievements: [],
                        }}
                        isEditing={true}
                        editedCoach={editedProfile}
                        handleChange={handleCoachChange}
                        handleSave={handleCoachSave}
                        handleCancel={handleCoachCancel}
                      />
                    </TabsContent>

                    <TabsContent value="stats">
                      <CoachStats
                        experience={legacyExperience}
                        isEditing={false}
                        editedExperience={legacyExperience}
                        handleChange={() => {}}
                      />
                    </TabsContent>

                    <TabsContent value="achievements">
                      <PlayerCoachAchievements
                        playerAchievements={[]}
                        coachAchievements={[]}
                        isEditing={true}
                        onAddPlayerAchievement={() => handleAddAchievement('playing')}
                        onUpdatePlayerAchievement={() => {}}
                        onRemovePlayerAchievement={() => {}}
                        onAddCoachAchievement={() => handleAddAchievement('coaching')}
                        onUpdateCoachAchievement={() => {}}
                        onRemoveCoachAchievement={() => {}}
                      />
                    </TabsContent>

                    <TabsContent value="feedbacks">
                      <PlayerCoachFeedbacks
                        playerFeedbacks={[]}
                        coachFeedbacks={[]}
                        isEditing={true}
                        // onAddPlayerFeedback={() => handleAddFeedback('playing')}
                        onAddPlayerFeedback={() => {}}
                        onUpdatePlayerFeedback={() => {}}
                        onRemovePlayerFeedback={() => {}}
                        onAddCoachFeedback={() => {}}
                        // onAddCoachFeedback={() => handleAddFeedback('coaching')}
                        onUpdateCoachFeedback={() => {}}
                        onRemoveCoachFeedback={() => {}}
                      />
                    </TabsContent>

                    <TabsContent value="education">
                      <CoachEducation
                        education={[]}
                        isEditing={true}
                        onAdd={handleAddEducation}
                        onUpdate={() => {}}
                        onRemove={() => {}}
                      />
                    </TabsContent>

                    <TabsContent value="specialties">
                      <CoachSpecialties
                        specialties={[]}
                        isEditing={true}
                        onAdd={handleAddSpecialty}
                        onUpdate={() => {}}
                        onRemove={() => {}}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    // Transform coach profile data for legacy components
    const legacyExperience = {
      yearsPlaying: parseInt(coachProfile.profile.playing_experience?.split(' ')[0] || '0'),
      yearsCoaching: coachProfile.years_coaching,
      analysisCompleted: coachProfile.statistics?.total_sessions || 0,
      activePlayers: coachProfile.statistics?.total_students || 0,
    };

    const legacyCoach = {
      name: coachProfile.profile.display_name || 'Coach',
      username: `coach_${coachProfile.id.slice(0, 8)}`,
      profileImage: coachProfile.profile.profile_image || coachProfile.profile.avatar_url || '/placeholder.svg',
      specialties: coachProfile.specialties?.map(s => ({
        name: s.specialty_type?.name || '',
        proficiency: s.proficiency
      })) || [],
    };

    const playerAchievements = coachProfile.achievements?.filter(a => a.achievement_type === 'playing') || [];
    const coachAchievements = coachProfile.achievements?.filter(a => a.achievement_type === 'coaching') || [];

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Coach Profile</h1>
            {!isCoachEditing ? (
              <Button onClick={handleCoachEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCoachCancel} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleCoachSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coach Profile Header */}
            <div className="lg:col-span-1">
              <CoachProfileHeader
                coach={legacyCoach}
                isEditing={isCoachEditing}
                previewImage={coachPreviewImage}
                handleEdit={handleCoachEdit}
                handleCancel={handleCoachCancel}
                handleSave={handleCoachSave}
                handleImageUpload={handleCoachImageUpload}
              />
            </div>

            {/* Coach Profile Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                  <TabsTrigger value="details" className="text-xs sm:text-sm px-2 py-1">Details</TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs sm:text-sm px-2 py-1">Stats</TabsTrigger>
                  <TabsTrigger value="achievements" className="text-xs sm:text-sm px-2 py-1">Achievements</TabsTrigger>
                  <TabsTrigger value="education" className="text-xs sm:text-sm px-2 py-1">Education</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-xs sm:text-sm px-2 py-1">Reviews</TabsTrigger>
                  {/* <TabsTrigger value="specialties" className="text-xs sm:text-sm px-2 py-1">Specialties</TabsTrigger>
                  <TabsTrigger value="pending-videos" className="text-xs sm:text-sm px-2 py-1">Pending</TabsTrigger>
                  <TabsTrigger value="analyzed-videos" className="text-xs sm:text-sm px-2 py-1">Analyzed</TabsTrigger> */}
                </TabsList>

                <TabsContent value="details">
                  <CoachDetails
                    coach={{
                      id: parseInt(coachProfile.id.replace(/-/g, '').substring(0, 8), 16),
                      name: coachProfile.profile.display_name || 'Coach',
                      image: coachProfile.profile.avatar_url || '/placeholder.svg',
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
                    isEditing={isCoachEditing}
                    editedCoach={editedProfile}
                    handleChange={handleCoachChange}
                    handleSave={handleCoachSave}
                    handleCancel={handleCoachCancel}
                  />
                </TabsContent>

                <TabsContent value="reviews">
                 <CoachReviews />
                </TabsContent>

                <TabsContent value="stats">
                  <CoachStats
                    experience={legacyExperience}
                    isEditing={false} // Stats are read-only
                    editedExperience={legacyExperience}
                    handleChange={() => {}}
                  />
                </TabsContent>

                <TabsContent value="achievements">
                  <PlayerCoachAchievements
                    playerAchievements={playerAchievements}
                    coachAchievements={coachAchievements}
                    isEditing={isCoachEditing}
                    onAddPlayerAchievement={() => handleAddAchievement('playing')}
                    onUpdatePlayerAchievement={(index, field, value) => {
                      const achievement = playerAchievements[index];
                      if (achievement) handleUpdateAchievement(achievement.id, field, value);
                    }}
                    onRemovePlayerAchievement={(index) => {
                      const achievement = playerAchievements[index];
                      if (achievement) handleRemoveAchievement(achievement.id);
                    }}
                    onAddCoachAchievement={() => handleAddAchievement('coaching')}
                    onUpdateCoachAchievement={(index, field, value) => {
                      const achievement = coachAchievements[index];
                      if (achievement) handleUpdateAchievement(achievement.id, field, value);
                    }}
                    onRemoveCoachAchievement={(index) => {
                      const achievement = coachAchievements[index];
                      if (achievement) handleRemoveAchievement(achievement.id);
                    }}
                  />
                </TabsContent>

                <TabsContent value="education">
                  <CoachEducation
                    education={coachProfile.education || []}
                    isEditing={isCoachEditing}
                    onAdd={handleAddEducation}
                    onUpdate={(index, field, value) => {
                      const education = coachProfile.education?.[index];
                      if (education) handleUpdateEducation(education.id, field, value);
                    }}
                    onRemove={(index) => {
                      const education = coachProfile.education?.[index];
                      if (education) handleRemoveEducation(education.id);
                    }}
                  />
                </TabsContent>

                <TabsContent value="specialties">
                  <CoachSpecialties
                    specialties={coachProfile.specialties || []}
                    isEditing={isCoachEditing}
                    onAdd={handleAddSpecialty}
                    onUpdate={(index, field, value) => {
                      const specialty = coachProfile.specialties?.[index];
                      if (specialty) handleUpdateSpecialty(specialty.id, field, value);
                    }}
                    onRemove={(index) => {
                      const specialty = coachProfile.specialties?.[index];
                      if (specialty) handleRemoveSpecialty(specialty.id);
                    }}
                  />
                </TabsContent>

                <TabsContent value="pending-videos">
                  <PendingVideosList coachId={authUser?.id} />
                </TabsContent>

                <TabsContent value="analyzed-videos">
                  <AnalyzedVideosList />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For regular players, show the original profile interface
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard
              user={user}
              isEditing={isEditing}
              onEdit={handleEdit}
              previewImage={previewImage}
              handleImageUpload={handleImageUpload}
            />
            <AnalysisQuotaCard />
          </div>
          <div className="lg:col-span-2">
            <ProfileTabs
              user={user}
              isEditing={isEditing}
              editedUser={editedUser}
              performanceData={performanceData}
              videos={videos}
              handleChange={handleChange}
              handleCancel={handleCancel}
              handleSave={handleSave}
              onDataUpdate={loadProfileData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
