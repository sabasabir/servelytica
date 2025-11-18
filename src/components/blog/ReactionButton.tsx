import React, { useState } from 'react';
import { Heart, ThumbsUp, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { reactionService } from '@/services/blogService';
import { toast } from 'sonner';

interface ReactionButtonProps {
  contentType: 'article' | 'comment' | 'forum_post' | 'answer';
  contentId: string;
  initialReaction?: string;
  initialCount?: number;
  onReactionChange?: (reaction: string | null, count: number) => void;
  size?: 'sm' | 'default' | 'lg';
}

const reactions = [
  { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
  { type: 'love', icon: Heart, label: 'Love', color: 'text-red-500' },
  { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-500' },
  { type: 'helpful', icon: HelpCircle, label: 'Helpful', color: 'text-green-500' }
];

const ReactionButton: React.FC<ReactionButtonProps> = ({
  contentType,
  contentId,
  initialReaction,
  initialCount = 0,
  onReactionChange,
  size = 'default'
}) => {
  const { user } = useAuth();
  const [currentReaction, setCurrentReaction] = useState(initialReaction);
  const [count, setCount] = useState(initialCount);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReaction = async (reactionType: string) => {
    if (!user) {
      toast.error('Please login to react');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const result = await reactionService.toggleReaction(
        user.id,
        contentType,
        contentId,
        reactionType as any
      );

      if (result) {
        // New or changed reaction
        setCurrentReaction(result.reaction_type);
        if (!currentReaction) {
          setCount(count + 1);
        }
      } else {
        // Removed reaction
        setCurrentReaction(undefined);
        setCount(Math.max(0, count - 1));
      }

      onReactionChange?.(result?.reaction_type || null, count);
      setIsOpen(false);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  const currentReactionData = reactions.find(r => r.type === currentReaction);
  const Icon = currentReactionData?.icon || ThumbsUp;
  const color = currentReactionData?.color || 'text-gray-500';

  const buttonSizes = {
    sm: 'h-8 px-2 text-sm',
    default: 'h-10 px-3',
    lg: 'h-12 px-4 text-lg'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className={`${buttonSizes[size]} ${currentReaction ? color : 'text-gray-500'} hover:bg-gray-100`}
          disabled={loading}
        >
          <Icon className={`${iconSizes[size]} mr-1 ${currentReaction ? 'fill-current' : ''}`} />
          <span>{count}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="center">
        <div className="flex gap-1">
          {reactions.map(reaction => {
            const ReactionIcon = reaction.icon;
            const isSelected = currentReaction === reaction.type;
            
            return (
              <button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                className={`
                  p-2 rounded-full transition-all
                  ${isSelected ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}
                  ${reaction.color}
                `}
                title={reaction.label}
                disabled={loading}
              >
                <ReactionIcon 
                  className={`h-5 w-5 ${isSelected ? 'fill-current' : ''}`} 
                />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReactionButton;