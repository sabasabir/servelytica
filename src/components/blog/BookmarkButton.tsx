import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookmarkService } from '@/services/blogService';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  contentType: 'article' | 'forum_post' | 'question';
  contentId: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  contentType,
  contentId,
  initialBookmarked = false,
  onBookmarkChange,
  size = 'default',
  showLabel = true
}) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    }
  }, [user, contentId]);

  const checkBookmarkStatus = async () => {
    if (!user) return;

    try {
      const bookmarks = await bookmarkService.getUserBookmarks(user.id, contentType);
      const isBookmarked = bookmarks.some(b => b.content_id === contentId);
      setIsBookmarked(isBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const newState = await bookmarkService.toggleBookmark(
        user.id,
        contentType,
        contentId
      );

      setIsBookmarked(newState);
      onBookmarkChange?.(newState);
      
      toast.success(
        newState ? 'Added to bookmarks' : 'Removed from bookmarks'
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-500'} hover:text-yellow-500`}
    >
      <Bookmark 
        className={`${iconSizes[size]} ${isBookmarked ? 'fill-current' : ''} ${showLabel ? 'mr-2' : ''}`} 
      />
      {showLabel && (
        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
};

export default BookmarkButton;