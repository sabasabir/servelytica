
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ARTICLES, CATEGORIES, TRENDING_TOPICS, WHO_TO_FOLLOW } from "@/components/blog/BlogData";
import BlogCategories from "@/components/blog/BlogCategories";
import BlogSuggestions from "@/components/blog/BlogSuggestions";
import FeaturedEvents from "@/components/blog/FeaturedEvents";
import BlogNavigation from "@/components/blog/BlogNavigation";
import ArticlesList from "@/components/blog/ArticlesList";
import { supabase } from "@/integrations/supabase/client";

const BlogPage = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // We'll use this to conditionally render the taskbar
  const [loading, setLoading] = useState(true);
  
//   // Filter articles based on search query and category
//   const filteredArticles = ARTICLES.filter(article => {
//     const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    
//     return matchesSearch && matchesCategory;
//   });


  
  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, allArticles]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles_with_counts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("fetched articles", data)
      
      const formattedData = data.map(article => ({
        ...article,
        date: new Date(article.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: `${article.read_time} min read`,
        author: article.author_name,
        category: article.category_name
      }));
      
      setAllArticles(formattedData);
      setFilteredArticles(formattedData);
    } catch (error) {
      console.error('Error fetching articles:', error.message);
    } finally {
      setLoading(false);
    }
  };


    const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      if (error) throw error;
      
      const categoryNames = data.map(cat => cat.name);
      setCategories(['All', ...categoryNames]);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

    const filterArticles = () => {
    const filtered = allArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredArticles(filtered);
  };


  console.log({categories, CATEGORIES})

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        {/* Header section - Only show when logged in */}
        {isLoggedIn && <BlogNavigation handleRefetch={()=>fetchArticles()} />}
        
        {/* Main content area with sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left sidebar (categories) */}
            <div className="lg:w-1/4">
              <BlogCategories 
                // categories={CATEGORIES}
                categories={categories}
                selectedCategory={selectedCategory}
                trendingTopics={TRENDING_TOPICS}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Center content (articles feed) */}
            <div className="lg:w-2/4">
              <ArticlesList articles={filteredArticles} />
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

export default BlogPage;
