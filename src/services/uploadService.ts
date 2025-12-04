
// Upload service - uploads directly to Supabase storage
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file directly to Supabase storage and creates database record
 * @param file The file to upload
 * @param userId The user ID
 * @param formData Additional form data (title, description, focusArea, coachIds)
 * @returns Object with success status, video data, file path and error if any
 */
export const uploadFileToStorage = async (
  file: File, 
  userId: string,
  formData?: {
    title?: string;
    description?: string;
    focusArea?: string;
    coachIds?: string[];
  }
) => {
  try {
    console.log('Starting upload for user:', userId);
    
    // Generate file path
    const fileExt = file.name.split('.').pop() || 'mp4';
    const filePath = `videos/${userId}/${Date.now()}.${fileExt}`;
    
    console.log('Uploading to path:', filePath);
    
    // Upload file to Supabase storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('videos')
      .upload(filePath, file, { 
        upsert: false,
        cacheControl: '3600',
        contentType: file.type || 'video/mp4'
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully, creating database record...');
    
    // Create video record in database
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        title: formData?.title || file.name.replace(/\.[^/.]+$/, ""),
        description: formData?.description || null,
        focus_area: formData?.focusArea || null,
        analyzed: false
      })
      .select()
      .single();
    
    if (videoError) {
      console.error('Database insert error:', videoError);
      throw videoError;
    }
    
    console.log('Video record created:', video?.id);
    
    // Assign coaches if provided
    if (formData?.coachIds && formData.coachIds.length > 0 && video?.id) {
      console.log('Assigning coaches:', formData.coachIds);
      const coachAssignments = formData.coachIds.map(coachId => ({
        video_id: video.id,
        coach_id: coachId,
        status: 'pending'
      }));
      
      const { error: coachError } = await supabase
        .from('video_coaches')
        .insert(coachAssignments);
      
      if (coachError) {
        console.error('Coach assignment error (non-fatal):', coachError);
        // Don't fail the upload if coach assignment fails
      }
    }
    
    return {
      success: true,
      filePath: filePath,
      video: video
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    
    let errorMessage = error?.message || 'Unknown error';
    
    // Provide helpful error messages
    if (errorMessage.includes('row-level security') || errorMessage.includes('RLS') || errorMessage.includes('policy')) {
      errorMessage = 'Security Policy Error: Please ensure RLS is disabled on videos and video_coaches tables.';
    } else if (errorMessage.includes('bucket') || errorMessage.includes('storage')) {
      errorMessage = 'Storage Error: Please check storage bucket permissions.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Saves a media record in the database
 * @param userId The user ID
 * @param filePath The path to the file in storage
 * @param file The original file
 * @param mediaType The type of media (e.g., 'video', 'image')
 * @returns Object with success status and error if any
 */
export const saveMediaRecord = async (
  userId: string,
  filePath: string,
  file: File,
  mediaType: 'video' | 'image'
) => {
  try {
    // Save to videos table instead of media table
    const { error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        title: null, // Will be set later in the upload form
        description: null,
        focus_area: null,
        analyzed: false,
        uploaded_at: new Date().toISOString()
      });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving media record:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Assigns coaches to a video
 * @param videoId The video ID
 * @param coachIds Array of coach user IDs
 * @returns Object with success status and error if any
 */
export const assignCoachesToVideo = async (
  videoId: string,
  coachIds: string[]
) => {
  try {
    if (!coachIds || coachIds.length === 0) {
      return { success: true }; // No coaches to assign
    }

    const coachAssignments = coachIds.map(coachId => ({
      video_id: videoId,
      coach_id: coachId,
      status: 'pending'
    }));

    const { error } = await supabase
      .from('video_coaches')
      .insert(coachAssignments);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning coaches:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
