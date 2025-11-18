import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CoachProfileService } from '@/services/coachProfileService';
import { FullCoachProfile, CoachSpecialty, CoachAchievement, CoachEducation, SpecialtyType, FocusArea } from '@/types/CoachProfile';
import { useToast } from '@/hooks/use-toast';

export const useCoachProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [coachProfile, setCoachProfile] = useState<FullCoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [specialtyTypes, setSpecialtyTypes] = useState<SpecialtyType[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load dropdown data
        const [specialtyTypesData, focusAreasData] = await Promise.all([
          CoachProfileService.getSpecialtyTypes(),
          CoachProfileService.getFocusAreas()
        ]);

        setSpecialtyTypes(specialtyTypesData);
        setFocusAreas(focusAreasData);

        // Load coach profile
        const profile = await CoachProfileService.getCoachProfile(user.id);
        setCoachProfile(profile);

        if (profile) {
          setEditedProfile({
            // Basic profile data
            display_name: profile.profile.display_name,
            bio: profile.profile.bio,
            location: profile.profile.location,
            playing_experience: profile.profile.playing_experience,
            preferred_play_style: profile.profile.preferred_play_style,
            profile_image: profile.profile.profile_image || profile.profile.avatar_url,
            // Coach profile data
            years_coaching: profile.years_coaching,
            coaching_philosophy: profile.coaching_philosophy,
            rate_per_hour: profile.rate_per_hour,
            currency: profile.currency,
            certifications: profile.certifications,
            languages: profile.languages,
          });
        }
      } catch (error) {
        console.error("Error loading coach profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load coach profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const handleEdit = () => {
    setIsEditing(true);
    
    // If no coach profile exists, create a basic structure for editing using existing user data
    if (!coachProfile || !coachProfile.id) {
      setEditedProfile({
        display_name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || '',
        bio: '',
        location: '',
        playing_experience: '',
        preferred_play_style: '',
        profile_image: user?.user_metadata?.profile_image || user?.user_metadata?.avatar_url || null,
        years_coaching: 0,
        coaching_philosophy: '',
        rate_per_hour: 0,
        currency: 'USD',
        certifications: [],
        languages: [],
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    // Reset edited profile to current data
    if (coachProfile) {
      setEditedProfile({
        display_name: coachProfile.profile.display_name,
        bio: coachProfile.profile.bio,
        location: coachProfile.profile.location,
        playing_experience: coachProfile.profile.playing_experience,
        preferred_play_style: coachProfile.profile.preferred_play_style,
        profile_image: coachProfile.profile.profile_image || coachProfile.profile.avatar_url,
        years_coaching: coachProfile.years_coaching,
        coaching_philosophy: coachProfile.coaching_philosophy,
        rate_per_hour: coachProfile.rate_per_hour,
        currency: coachProfile.currency,
        certifications: coachProfile.certifications,
        languages: coachProfile.languages,
      });
    }
  };

  const handleSave = async () => {
    if (!user || !editedProfile) return;

    try {
      setLoading(true);

      // Update basic profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: editedProfile.display_name,
          bio: editedProfile.bio,
          location: editedProfile.location,
          playing_experience: editedProfile.playing_experience,
          preferred_play_style: editedProfile.preferred_play_style,
          profile_image: editedProfile.profile_image || null,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Create or update coach profile
      const coachProfileData = await CoachProfileService.upsertCoachProfile(user.id, {
        years_coaching: editedProfile.years_coaching || 0,
        coaching_philosophy: editedProfile.coaching_philosophy,
        rate_per_hour: editedProfile.rate_per_hour,
        currency: editedProfile.currency || 'USD',
        certifications: editedProfile.certifications || [],
        languages: editedProfile.languages || [],
      });

      if (!coachProfileData) {
        throw new Error('Failed to create or update coach profile');
      }

      // Only create statistics record if this is a completely new profile
      if (!coachProfile?.id && coachProfileData.id) {
        // Check if statistics record already exists
        const { data: existingStats, error: statsCheckError } = await supabase
          .from('coach_statistics')
          .select('id')
          .eq('coach_profile_id', coachProfileData.id)
          .maybeSingle();

        if (!existingStats && !statsCheckError) {
          const { error: statsError } = await supabase
            .from('coach_statistics')
            .insert({
              coach_profile_id: coachProfileData.id,
              total_sessions: 0,
              total_students: 0,
              average_rating: 0,
              total_reviews: 0,
              response_time_hours: 24,
              success_rate: 0,
            });

          if (statsError) {
            console.error('Error creating statistics:', statsError);
            // Don't throw here as profile creation succeeded
          }
        }
      }

      // Reload the profile data
      const updatedProfile = await CoachProfileService.getCoachProfile(user.id);
      setCoachProfile(updatedProfile);

      setIsEditing(false);
      setPreviewImage(null);

      toast({
        title: "Success",
        description: coachProfile?.id ? "Profile updated successfully" : "Coach profile created successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile changes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setPreviewImage(imageDataUrl);
        // Also update the edited profile with the image
        setEditedProfile((prev: any) => ({
          ...prev,
          profile_image: imageDataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Specialty management
  const handleAddSpecialty = async () => {
    if (!coachProfile?.id || !specialtyTypes.length) return;

    try {
      // Add a default specialty that can be edited
      const success = await CoachProfileService.addSpecialty(
        coachProfile.id, 
        specialtyTypes[0].id, 
        'intermediate', 
        0
      );

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Specialty added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add specialty",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSpecialty = async (specialtyId: string, field: string, value: string) => {
    try {
      const success = await CoachProfileService.updateSpecialty(specialtyId, {
        [field]: field === 'years_experience' ? parseInt(value) : value,
      });

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update specialty",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSpecialty = async (specialtyId: string) => {
    try {
      const success = await CoachProfileService.removeSpecialty(specialtyId);

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Specialty removed successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove specialty",
        variant: "destructive",
      });
    }
  };

  // Achievement management
  const handleAddAchievement = async (type: 'playing' | 'coaching') => {
    if (!coachProfile?.id) return;

    try {
      const success = await CoachProfileService.addAchievement(coachProfile.id, {
        title: '',
        description: '',
        year: new Date().getFullYear(),
        organization: '',
        achievement_type: type,
      });

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Achievement added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add achievement",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAchievement = async (achievementId: string, field: string, value: string) => {
    try {
      const success = await CoachProfileService.updateAchievement(achievementId, {
        [field]: field === 'year' ? parseInt(value) : value,
      });

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update achievement",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAchievement = async (achievementId: string) => {
    try {
      const success = await CoachProfileService.removeAchievement(achievementId);

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Achievement removed successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove achievement",
        variant: "destructive",
      });
    }
  };

  // Education management
  const handleAddEducation = async () => {
    if (!coachProfile?.id) return;

    try {
      const success = await CoachProfileService.addEducation(coachProfile.id, {
        degree: '',
        institution: '',
        year_completed: new Date().getFullYear(),
        field_of_study: '',
      });

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Education added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add education",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEducation = async (educationId: string, field: string, value: string) => {
    try {
      const success = await CoachProfileService.updateEducation(educationId, {
        [field]: field === 'year_completed' ? parseInt(value) : value,
      });

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update education",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEducation = async (educationId: string) => {
    try {
      const success = await CoachProfileService.removeEducation(educationId);

      if (success) {
        const updatedProfile = await CoachProfileService.getCoachProfile(user!.id);
        setCoachProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Education removed successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove education",
        variant: "destructive",
      });
    }
  };

  return {
    coachProfile,
    loading,
    isEditing,
    editedProfile,
    previewImage,
    specialtyTypes,
    focusAreas,
    handleEdit,
    handleCancel,
    handleSave,
    handleChange,
    handleImageUpload,
    handleAddSpecialty,
    handleUpdateSpecialty,
    handleRemoveSpecialty,
    handleAddAchievement,
    handleUpdateAchievement,
    handleRemoveAchievement,
    handleAddEducation,
    handleUpdateEducation,
    handleRemoveEducation,
  };
};