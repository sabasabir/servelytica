
import { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress sx={{ color: "#ff7e00" }} />
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 8 } }}>
        {/* Header */}
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#ff7e00",
                letterSpacing: "2px",
                mb: 2,
                textTransform: "uppercase",
                fontFamily: '"Poppins", "Sora", sans-serif',
              }}
            >
              INSIGHTS & STORIES
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "28px", md: "40px" },
                fontWeight: 800,
                color: "#1a365d",
                mb: 2,
                fontFamily: '"Poppins", "Sora", sans-serif',
                textTransform: "uppercase",
              }}
            >
              SPORTS COACHING BLOG
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#64748b", maxWidth: "600px", mx: "auto" }}>
              Expert tips, training guides, and coaching insights from industry professionals
            </Typography>
          </motion.div>
        </Box>

        {/* Blog Navigation */}
        {isLoggedIn && <BlogNavigation handleRefetch={() => fetchArticles()} />}

        {/* Main Content */}
        <Container maxWidth="lg">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr 1fr" }, gap: { xs: 2, md: 4 } }}>
            {/* Left Sidebar */}
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <BlogCategories
                categories={categories}
                selectedCategory={selectedCategory}
                trendingTopics={TRENDING_TOPICS}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>

            {/* Center Content */}
            <Box>
              <ArticlesList articles={filteredArticles} />
            </Box>

            {/* Right Sidebar */}
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <BlogSuggestions peopleToFollow={WHO_TO_FOLLOW} />
              <FeaturedEvents />
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default BlogPage;
