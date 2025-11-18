import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  Reply, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { commentService, reactionService } from '@/services/blogService';
import { Comment } from '@/types/Blog';
import { toast } from 'sonner';

interface CommentSystemProps {
  articleId: string;
  onCommentCountChange?: (count: number) => void;
}

const CommentSystem: React.FC<CommentSystemProps> = ({ articleId, onCommentCountChange }) => {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(articleId);
      setComments(data);
      const totalCount = data.reduce((count, comment) => 
        count + 1 + (comment.replies?.length || 0), 0
      );
      onCommentCountChange?.(totalCount);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const comment = await commentService.createComment({
        article_id: articleId,
        author_id: user.id,
        content: newComment.trim(),
        parent_id: replyTo
      });

      if (replyTo) {
        // Add to replies
        setComments(prev => prev.map(c => {
          if (c.id === replyTo) {
            return { ...c, replies: [...(c.replies || []), comment] };
          }
          return c;
        }));
      } else {
        // Add to top level
        setComments(prev => [comment, ...prev]);
      }

      setNewComment('');
      setReplyTo(null);
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await commentService.updateComment(commentId, editContent);
      setComments(prev => updateCommentInTree(prev, commentId, { content: editContent }));
      setEditingId(null);
      setEditContent('');
      toast.success('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(prev => removeCommentFromTree(prev, commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleReaction = async (commentId: string, reactionType: 'like') => {
    if (!user) {
      toast.error('Please login to react');
      return;
    }

    try {
      await reactionService.toggleReaction(user.id, 'comment', commentId, reactionType);
      // Reload comments to get updated reaction counts
      loadComments();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const updateCommentInTree = (comments: Comment[], commentId: string, updates: Partial<Comment>): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, ...updates };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updates)
        };
      }
      return comment;
    });
  };

  const removeCommentFromTree = (comments: Comment[], commentId: string): Comment[] => {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
        replies: comment.replies ? removeCommentFromTree(comment.replies, commentId) : undefined
      }));
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => {
    const isAuthor = user?.id === comment.author_id;
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div className={`${isReply ? 'ml-8 mt-2' : 'mb-4'}`}>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author?.avatar_url} />
              <AvatarFallback>
                {comment.author?.display_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">
                    {comment.author?.display_name || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {comment.edited_at && (
                    <span className="text-xs text-gray-400 ml-1">(edited)</span>
                  )}
                </div>

                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="mt-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
              )}

              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => handleReaction(comment.id, 'like')}
                  className={`flex items-center gap-1 text-sm ${
                    comment.user_reaction ? 'text-red-500' : 'text-gray-500'
                  } hover:text-red-500 transition-colors`}
                >
                  <Heart className={`h-4 w-4 ${comment.user_reaction ? 'fill-current' : ''}`} />
                  <span>{comment.reactions_count || 0}</span>
                </button>

                {!isReply && (
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                )}

                {hasReplies && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {expandedReplies.has(comment.id) ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide {comment.replies?.length} replies
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show {comment.replies?.length} replies
                      </>
                    )}
                  </button>
                )}
              </div>

              {replyTo === comment.id && (
                <div className="mt-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={loading || !newComment.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyTo(null);
                        setNewComment('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {hasReplies && expandedReplies.has(comment.id) && (
          <div className="mt-2">
            {comment.replies?.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {user && (
        <Card className="p-4 mb-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback>
                {userProfile?.display_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[80px]"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSubmitComment}
                  disabled={loading || !newComment.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {comments.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </Card>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;