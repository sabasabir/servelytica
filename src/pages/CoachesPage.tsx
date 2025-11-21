

import { useState, useEffect } from "react";
import { Box, Container, Typography, Card, CardContent, TextField, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoachSearch from "@/components/coaches/CoachSearch";
import CoachGrid from "@/components/coaches/CoachGrid";
import { CoachService } from "@/services/coachService";
import { Coach } from "@/types/Coach";

const CoachesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true);
      try {
        const fetchedCoaches = await CoachService.getCoaches();
        setCoaches(fetchedCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);
  
  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           coach.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && coach.category === activeTab;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
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
      
      <Box component="main" sx={{ flex: 1, py: { xs: 8, md: 14 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: { xs: 8, md: 10 } }}>
              <Typography
                sx={{
                  color: "#ff7e00",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "2px",
                  mb: 2,
                  textTransform: "uppercase",
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                EXPERT GUIDANCE
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "48px" },
                  fontWeight: 800,
                  mb: 3,
                  color: "#1a365d",
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                OUR EXPERT COACHES
              </Typography>

              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#64748b",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Choose from our roster of professional coaches for personalized analysis and guidance
              </Typography>
            </Box>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: "32px" }}
          >
            <CoachSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </motion.div>

          {/* Coaches Grid */}
          <CoachGrid coaches={filteredCoaches} resetFilters={resetFilters} />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default CoachesPage;
