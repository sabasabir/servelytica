
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPost from "@/components/blog/BlogPost";
import BlogSuggestions from "@/components/blog/BlogSuggestions";
import FeaturedEvents from "@/components/blog/FeaturedEvents";
import { ARTICLES, WHO_TO_FOLLOW } from "@/components/blog/BlogData";
import { supabase } from "@/integrations/supabase/client";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState(ARTICLES[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   const fetchArticles = async (id) => {
      try {
        const { data: article, error } = await supabase
          .from('articles_with_counts')
          .select('*')
          .eq('id', id)
          .single();
  
        if (error) throw error;

        
        const formattedData = {
          ...article,
          date: new Date(article.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: `${article.read_time} min read`,
          author: article.author_name,
          category: article.category_name
        };
        
        setArticle(formattedData);
        setError(null);
        // setAllArticles(formattedData);
        // setFilteredArticles(formattedData);
      } catch (error) {
        console.error('Error fetching articles:', error.message);
      } finally {
        setLoading(false);
      }
    };
  

  useEffect(() => {
    if (id) {
      setLoading(true);

      fetchArticles(id);
      // In a real app, we would fetch this from an API
      const articleId = parseInt(id);
      const foundArticle = ARTICLES.find(a => a.id === articleId);
      
      if (foundArticle) {
        setArticle(foundArticle);
        setError(null);
      } else {
        setError("Article not found");
      }
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content area (article) */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Loading article...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center bg-white rounded-lg shadow">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">{error}</h3>
                  <p className="text-gray-500">The requested article could not be found.</p>
                </div>
              ) : (
                <BlogPost article={article} />
              )}
            </div>
            
            {/* Right sidebar (who to follow, etc) */}
            <div className="lg:w-1/4">
              <BlogSuggestions peopleToFollow={WHO_TO_FOLLOW} />
              <FeaturedEvents />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
