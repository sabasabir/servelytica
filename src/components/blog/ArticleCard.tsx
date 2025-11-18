
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageCircle, Share2, User } from "lucide-react";
import { useState } from "react";
import ShareModal from "../ShareModal";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  likes?: number;
  comments?: number;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes || 0);
    const [openShareOptions, setOpenShareOptions] = useState<{ open: boolean; id: number | null } | null>(null);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <>
      {openShareOptions?.open && <ShareModal
          isOpen={openShareOptions.open}
          onClose={() => setOpenShareOptions(null)}
          blogPath={`/blog/post/${openShareOptions?.id}`}
        />}
    <Card className="overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300 border-gray-200">
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <User className="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-sm">{article.author}</p>
          <p className="text-xs text-gray-500">{article.date}</p>
        </div>
        <Badge className="ml-auto bg-tt-blue hover:bg-tt-blue/90">{article.category}</Badge>
      </div>
      
      <Link to={`/blog/post/${article.id}`}>
        <div className="aspect-video overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <CardContent className="pt-4">
          <h3 className="text-xl font-semibold mb-2 hover:text-tt-orange transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        </CardContent>
      </Link>
      
      <CardFooter className="border-t pt-3 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-red-500' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </button>
          
          <Link to={`/blog/post/${article.id}#comments`} className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{article.comments || 0}</span>
          </Link>
          
          <button onClick={()=> setOpenShareOptions({ open: true, id: article.id })} className="flex items-center gap-1 text-gray-500 hover:text-tt-blue transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          <span>{article.readTime}</span>
        </div>
      </CardFooter>
    </Card>
    </>
  );
};

export default ArticleCard;
