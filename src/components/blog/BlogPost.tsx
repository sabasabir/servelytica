
// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { 
// //   ArrowLeft, 
// //   Heart, 
// //   MessageCircle, 
// //   Share2, 
// //   Bookmark, 
// //   Clock, 
// //   User 
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { AspectRatio } from "@/components/ui/aspect-ratio";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import ShareModal from "../ShareModal";

// // interface BlogPostProps {
// //   article: {
// //     id: number;
// //     title: string;
// //     excerpt: string;
// //     content: string;
// //     date: string;
// //     author: string;
// //     category: string;
// //     image: string;
// //     readTime: string;
// //     likes?: number;
// //     comments?: number;
// //   };
// // }

// // const BlogPost = ({ article }: BlogPostProps) => {
// //   const [liked, setLiked] = useState(false);
// //   const [likeCount, setLikeCount] = useState(article.likes || 0);
// //   const [bookmarked, setBookmarked] = useState(false);
// //   const navigate = useNavigate();
// //     const [openShareOptions, setOpenShareOptions] = useState<{ open: boolean; id: number | null } | null>(null);

// //   const handleLike = () => {
// //     setLiked(!liked);
// //     setLikeCount(liked ? likeCount - 1 : likeCount + 1);
// //   };

  


// //   const handleBookmark = () => {
// //     setBookmarked(!bookmarked);
// //   };

// //   const handleShare = () => {
// //     setOpenShareOptions({ open: true, id: article.id });
// //   };

// //   const handleBack = () => {
// //     navigate(-1);
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <div className="mb-6">
// //         <Button 
// //           variant="ghost" 
// //           className="pl-0 mb-4 text-gray-500 hover:text-tt-blue"
// //           onClick={handleBack}
// //         >
// //           <ArrowLeft className="mr-2 h-4 w-4" />
// //           Back to articles
// //         </Button>

// //         <Badge className="mb-4 bg-tt-blue hover:bg-tt-blue/90">
// //           {article.category}
// //         </Badge>

// //         <h1 className="text-3xl md:text-4xl font-bold mb-4">
// //           {article.title}
// //         </h1>

// //         <div className="flex items-center gap-4 mb-6">
// //           <div className="flex items-center gap-2">
// //             <Avatar className="h-10 w-10">
// //               <AvatarFallback>
// //                 <User className="h-6 w-6 text-gray-500" />
// //               </AvatarFallback>
// //             </Avatar>
// //             <div>
// //               <p className="font-medium text-sm">{article.author}</p>
// //               <div className="flex items-center justify-center">
// //               <p className="text-xs text-gray-500">{article.date}</p>
                
// //                 <div className="flex items-center text-xs text-gray-500 ms-3">
// //                     <Clock className="mr-1 h-4 w-4" />
// //                     <span>{article.readTime}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <Card className="overflow-hidden mb-8 border-gray-200">
// //         <AspectRatio ratio={16 / 9}>
// //           <img 
// //             src={article.image} 
// //             alt={article.title} 
// //             className="w-full h-full object-cover" 
// //           />
// //         </AspectRatio>
        
// //         <CardContent className="pt-6 pb-4">
// //           <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
// //             <p className="text-lg font-medium mb-4">{article.excerpt}</p>
// //             <div dangerouslySetInnerHTML={{ __html: article.content }} />
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <div className="flex items-center justify-between mb-8 border-t border-b py-4">
// //         <div className="flex items-center gap-4">
// //           <button 
// //             className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
// //             onClick={handleLike}
// //           >
// //             <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
// //             <span className="text-sm">{likeCount}</span>
// //           </button>
          
// //           <Link to="#comments" className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors">
// //             <MessageCircle className="h-5 w-5" />
// //             <span className="text-sm">{article.comments || 0}</span>
// //           </Link>
          
// //           <button 
// //             className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors"
// //             onClick={handleShare}
// //           >
// //             <Share2 className="h-5 w-5" />
// //             <span className="text-sm">Share</span>
// //           </button>

// //           <button 
// //             className={`flex items-center gap-1 ${bookmarked ? 'text-tt-orange' : 'text-gray-500'} hover:text-tt-orange transition-colors`}
// //             onClick={handleBookmark}
// //           >
// //             <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-tt-orange' : ''}`} />
// //             <span className="text-sm">Save</span>
// //           </button>
// //         </div>
// //       </div>

// //       <div id="comments" className="mb-8">
// //         <h2 className="text-xl font-semibold mb-4">Comments ({article.comments || 0})</h2>
// //         {(article.comments && article.comments > 0) ? (
// //           <div className="space-y-4">
// //             {/* In a real app, we would fetch and display comments here */}
// //             <p className="text-gray-500">Loading comments...</p>
// //           </div>
// //         ) : (
// //           <Alert className="bg-gray-50">
// //             <AlertDescription>
// //               No comments yet. Be the first to share your thoughts!
// //             </AlertDescription>
// //           </Alert>
// //         )}
// //       </div>

// //       {openShareOptions?.open && <ShareModal
// //           isOpen={openShareOptions.open}
// //           onClose={() => setOpenShareOptions(null)}
// //           blogPath={`/blog/post/${openShareOptions?.id}`}
// //         />}
// //     </div>
// //   );
// // };

// // export default BlogPost;



// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, 
//   Heart, 
//   MessageCircle, 
//   Share2, 
//   Bookmark, 
//   Clock, 
//   User,
//   Send,
//   Trash
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import ShareModal from "../ShareModal";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/contexts/AuthContext";

// // Add supabase client import - adjust path as needed
// // import { supabase } from "@/lib/supabase";

// interface Comment {
//   id: string;
//   article_id: string;
//   author_id: string;
//   content: string;
//   author_name?: string;
//   created_at: string;
// }

// interface BlogPostProps {
//   article: {
//     id: number;
//     title: string;
//     excerpt: string;
//     content: string;
//     date: string;
//     author: string;
//     category: string;
//     image: string;
//     readTime: string;
//     likes?: number;
//     comments?: number;
//   };
// }

// const BlogPost = ({ article }: BlogPostProps) => {
//   const { userProfile, signOut } = useAuth();
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(article.likes || 0);
//   const [bookmarked, setBookmarked] = useState(false);
//   const [showCommentForm, setShowCommentForm] = useState(false);
//   const [commentContent, setCommentContent] = useState("");
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [commentCount, setCommentCount] = useState(article.comments || 0);
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const navigate = useNavigate();
//   const [openShareOptions, setOpenShareOptions] = useState<{ open: boolean; id: number | null } | null>(null);

//   console.log({userProfile})

//   // Load comments on component mount
//   useEffect(() => {
//     loadComments();
//   }, [article.id]);

//   const loadComments = async () => {
//     try {
//       // Uncomment and adjust when you have supabase setup
//       const { data, error } = await supabase
//         .from('comments')
//         .select(`*, user: author_id(*)`)
//         .eq('article_id', article.id)
//         .order('created_at', { ascending: false });

//         console.log({data})
      
//       if (error) throw error;
//       setComments(data || []);
//       setCommentCount(data?.length || 0);
      
//       // Mock data for demo
//     //   setComments([]);
//     } catch (error) {
//       console.error('Error loading comments:', error);
//     }
//   };

//   const handleLike = () => {
//     setLiked(!liked);
//     setLikeCount(liked ? likeCount - 1 : likeCount + 1);
//   };

//   const handleBookmark = () => {
//     setBookmarked(!bookmarked);
//   };

//   const handleShare = () => {
//     setOpenShareOptions({ open: true, id: article.id });
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleCommentClick = () => {
//     setShowCommentForm(!showCommentForm);
//   };

//   const handleCommentSubmit = async () => {
//     if (!commentContent.trim()) return;

//     setIsSubmittingComment(true);
    
//     try {
//       // Replace with your actual user ID and implement supabase call
//       const newComment = {
//         article_id: article.id.toString(),
//         author_id: userProfile?.id?.toString(), // Replace with actual user ID
//         content: commentContent.trim()
//       };

//       // Uncomment when you have supabase setup
//       const { data, error } = await supabase
//         .from(`comments`)
//         .insert([newComment])
//         .select()
//         .single();

//       if (error) throw error;

//       // Mock success for demo
//       const mockComment: Comment = {
//         id: Date.now().toString(),
//         article_id: article.id.toString(),
//         author_id: 'current-user-id',
//         content: commentContent.trim(),
//         author_name: 'Current User',
//         created_at: new Date().toISOString()
//       };

//       setComments(prev => [mockComment, ...prev]);
//       setCommentCount(prev => prev + 1);
//       setCommentContent("");
//       setShowCommentForm(false);

//       // Show success message or handle as needed
//       console.log('Comment posted successfully');
      
//     } catch (error) {
//       console.error('Error posting comment:', error);
//       // Handle error (show toast, alert, etc.)
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-6">
//         <Button 
//           variant="ghost" 
//           className="pl-0 mb-4 text-gray-500 hover:text-tt-blue"
//           onClick={handleBack}
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to articles
//         </Button>

//         <Badge className="mb-4 bg-tt-blue hover:bg-tt-blue/90">
//           {article.category}
//         </Badge>

//         <h1 className="text-3xl md:text-4xl font-bold mb-4">
//           {article.title}
//         </h1>

//         <div className="flex items-center gap-4 mb-6">
//           <div className="flex items-center gap-2">
//             <Avatar className="h-10 w-10">
//               <AvatarFallback>
//                 <User className="h-6 w-6 text-gray-500" />
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="font-medium text-sm">{article.author}</p>
//               <div className="flex items-center justify-center">
//               <p className="text-xs text-gray-500">{article.date}</p>
                
//                 <div className="flex items-center text-xs text-gray-500 ms-3">
//                     <Clock className="mr-1 h-4 w-4" />
//                     <span>{article.readTime}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Card className="overflow-hidden mb-8 border-gray-200">
//         <AspectRatio ratio={16 / 9}>
//           <img 
//             src={article.image} 
//             alt={article.title} 
//             className="w-full h-full object-cover" 
//           />
//         </AspectRatio>
        
//         <CardContent className="pt-6 pb-4">
//           <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
//             <p className="text-lg font-medium mb-4">{article.excerpt}</p>
//             <div dangerouslySetInnerHTML={{ __html: article.content }} />
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex items-center justify-between mb-8 border-t border-b py-4">
//         <div className="flex items-center gap-4">
//           <button 
//             className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
//             onClick={handleLike}
//           >
//             <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
//             <span className="text-sm">{likeCount}</span>
//           </button>
          
//           <button 
//             className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors"
//             onClick={handleCommentClick}
//           >
//             <MessageCircle className="h-5 w-5" />
//             <span className="text-sm">{commentCount}</span>
//           </button>
          
//           <button 
//             className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors"
//             onClick={handleShare}
//           >
//             <Share2 className="h-5 w-5" />
//             <span className="text-sm">Share</span>
//           </button>

//           <button 
//             className={`flex items-center gap-1 ${bookmarked ? 'text-tt-orange' : 'text-gray-500'} hover:text-tt-orange transition-colors`}
//             onClick={handleBookmark}
//           >
//             <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-tt-orange' : ''}`} />
//             <span className="text-sm">Save</span>
//           </button>
//         </div>
//       </div>

//       {/* Comment Form */}
//       {showCommentForm && (
//         <Card className="mb-6 border-gray-200">
//           <CardContent className="pt-6">
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <textarea
//                   value={commentContent}
//                   onChange={(e) => setCommentContent(e.target.value)}
//                   placeholder="Write your comment..."
//                   className="w-full p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-tt-blue focus:border-transparent"
//                   rows={3}
//                 />
//               </div>
//               <div className="flex flex-col justify-end">
//                 <Button
//                   onClick={handleCommentSubmit}
//                   disabled={!commentContent.trim() || isSubmittingComment}
//                   className="bg-tt-blue hover:bg-tt-blue/90 text-white px-4 py-2"
//                 >
//                   {isSubmittingComment ? (
//                     "Posting..."
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Comment
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div id="comments" className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">Comments ({commentCount})</h2>
//         {comments.length > 0 ? (
//           <div className="space-y-4">
//             {comments.map((comment) => (
//               <Card key={comment.id} className="border-gray-200 relative">
//                 <CardContent className="pt-4">
//                   <div className="flex items-start gap-3">
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback>
//                         <User className="h-4 w-4 text-gray-500" />
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <p className="font-medium text-sm">
//                           {comment?.user?.display_name || 'Anonymous User'}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {formatDate(comment.created_at)}
//                         </p>
//                       </div>
//                       <p className="text-sm text-gray-700 leading-relaxed">
//                         {comment.content}
//                       </p>
//                     </div>

//                     {comment?.user?.id === userProfile?.id && <button onClick={() => handleDelete(comment.id)}>
//                         <Trash className="text-red-600" />
//                     </button>}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Alert className="bg-gray-50">
//             <AlertDescription>
//               No comments yet. Be the first to share your thoughts!
//             </AlertDescription>
//           </Alert>
//         )}
//       </div>

//       {openShareOptions?.open && <ShareModal
//           isOpen={openShareOptions.open}
//           onClose={() => setOpenShareOptions(null)}
//           blogPath={`/blog/post/${openShareOptions?.id}`}
//         />}
//     </div>
//   );
// };

// export default BlogPost;



import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Clock, 
  User,
  Send,
  Trash,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ShareModal from "../ShareModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Add supabase client import - adjust path as needed
// import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  article_id: string;
  author_id: string;
  content: string;
  author_name?: string;
  created_at: string;
}

interface BlogPostProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    image: string;
    readTime: string;
    likes?: number;
    comments?: number;
  };
}

const BlogPost = ({ article }: BlogPostProps) => {
  const { userProfile, signOut } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(article.comments || 0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const navigate = useNavigate();
  const [openShareOptions, setOpenShareOptions] = useState<{ open: boolean; id: number | null } | null>(null);
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  console.log({userProfile})

  // Load comments on component mount
  useEffect(() => {
    loadComments();
  }, [article.id]);

  const loadComments = async () => {
    try {
      // Uncomment and adjust when you have supabase setup
      const { data, error } = await supabase
        .from('comments')
        .select(`*, user: author_id(*)`)
        .eq('article_id', article.id)
        .order('created_at', { ascending: false });

        console.log({data})
      
      if (error) throw error;
      setComments(data || []);
      setCommentCount(data?.length || 0);
      
      // Mock data for demo
    //   setComments([]);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    setOpenShareOptions({ open: true, id: article.id });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentClick = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    setIsSubmittingComment(true);
    
    try {
      // Replace with your actual user ID and implement supabase call
      const newComment = {
        article_id: article.id.toString(),
        author_id: userProfile?.id?.toString(), // Replace with actual user ID
        content: commentContent.trim()
      };

      // Uncomment when you have supabase setup
      const { data, error } = await supabase
        .from(`comments`)
        .insert([newComment])
        .select()
        .single();

      if (error) throw error;

      // Mock success for demo
      const mockComment: Comment = {
        id: Date.now().toString(),
        article_id: article.id.toString(),
        author_id: 'current-user-id',
        content: commentContent.trim(),
        author_name: 'Current User',
        created_at: new Date().toISOString()
      };

      setComments(prev => [mockComment, ...prev]);
      setCommentCount(prev => prev + 1);
      setCommentContent("");
      setShowCommentForm(false);

      // Show success message or handle as needed
      console.log('Comment posted successfully');
      
    } catch (error) {
      console.error('Error posting comment:', error);
      // Handle error (show toast, alert, etc.)
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', userProfile.id);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setCommentCount(prev => prev - 1);
      
      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editCommentContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editCommentContent.trim() })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editCommentContent.trim() }
          : comment
      ));

      setEditingCommentId(null);
      setEditCommentContent("");
      
      console.log('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="pl-0 mb-4 text-gray-500 hover:text-tt-blue"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to articles
        </Button>

        <Badge className="mb-4 bg-tt-blue hover:bg-tt-blue/90">
          {article.category}
        </Badge>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                <User className="h-6 w-6 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{article.author}</p>
              <div className="flex items-center justify-center">
              <p className="text-xs text-gray-500">{article.date}</p>
                
                <div className="flex items-center text-xs text-gray-500 ms-3">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden mb-8 border-gray-200">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover" 
          />
        </AspectRatio>
        
        <CardContent className="pt-6 pb-4">
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p className="text-lg font-medium mb-4">{article.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-8 border-t border-b py-4">
        <div className="flex items-center gap-4">
          <button 
            className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </button>
          
          <button 
            className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{commentCount}</span>
          </button>
          
          <button 
            className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </button>

          <button 
            className={`flex items-center gap-1 ${bookmarked ? 'text-tt-orange' : 'text-gray-500'} hover:text-tt-orange transition-colors`}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-tt-orange' : ''}`} />
            <span className="text-sm">Save</span>
          </button>
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card className="mb-6 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-tt-blue focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!commentContent.trim() || isSubmittingComment}
                  className="bg-tt-blue hover:bg-tt-blue/90 text-white px-4 py-2"
                >
                  {isSubmittingComment ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div id="comments" className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Comments ({commentCount})</h2>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card 
                key={comment.id} 
                className="border-gray-200 relative"
                onMouseEnter={() => setHoveredCommentId(comment.id)}
                onMouseLeave={() => setHoveredCommentId(null)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-sm">
                          {comment?.user?.display_name || ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </p>
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-tt-blue focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditSubmit(comment.id)}
                              disabled={!editCommentContent.trim()}
                              className="bg-tt-blue hover:bg-tt-blue/90 text-white px-3 py-1 text-sm"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleEditCancel}
                              className="px-3 py-1 text-sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                    </div>

                    {/* Show edit/delete buttons only on hover and if user owns the comment */}
                    {hoveredCommentId === comment.id && comment?.user?.id === userProfile?.id && (
                      <div className="flex gap-2 absolute top-2 right-2">
                        <button 
                          onClick={() => handleEdit(comment)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert className="bg-gray-50">
            <AlertDescription>
              No comments yet. Be the first to share your thoughts!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {openShareOptions?.open && <ShareModal
          isOpen={openShareOptions.open}
          onClose={() => setOpenShareOptions(null)}
          blogPath={`/blog/post/${openShareOptions?.id}`}
        />}
    </div>
  );
};

export default BlogPost;