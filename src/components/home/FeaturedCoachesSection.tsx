import { motion } from "framer-motion";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import FeaturedCoachCard from "./FeaturedCoachCard";
import { FeaturedCoachService } from "@/services/featuredCoachService";

const FeaturedCoachesSection = () => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCoaches();
  }, []);

  const fetchFeaturedCoaches = async () => {
    setLoading(true);
    try {
      const data = await FeaturedCoachService.getFeaturedCoaches(3);
      // If no data, show sample coaches
      if (!data || data.length === 0) {
        setCoaches([
          {
            id: 1,
            coachId: "sample-1",
            name: "Michael Chen",
            title: "Former National Champion",
            rating: 4.9,
            reviews: 124,
            image: "MC",
            displayOrder: 1,
          },
          {
            id: 2,
            coachId: "sample-2",
            name: "Sarah Wong",
            title: "Olympic Medalist",
            rating: 5.0,
            reviews: 98,
            image: "SW",
            displayOrder: 2,
          },
          {
            id: 3,
            coachId: "sample-3",
            name: "David Müller",
            title: "Professional Coach",
            rating: 4.8,
            reviews: 156,
            image: "DM",
            displayOrder: 3,
          },
        ]);
      } else {
        setCoaches(data);
      }
    } catch (error) {
      console.error("Error fetching featured coaches:", error);
      // Show sample coaches on error
      setCoaches([
        {
          id: 1,
          coachId: "sample-1",
          name: "Michael Chen",
          title: "Former National Champion",
          rating: 4.9,
          reviews: 124,
          image: "MC",
          displayOrder: 1,
        },
        {
          id: 2,
          coachId: "sample-2",
          name: "Sarah Wong",
          title: "Olympic Medalist",
          rating: 5.0,
          reviews: 98,
          image: "SW",
          displayOrder: 2,
        },
        {
          id: 3,
          coachId: "sample-3",
          name: "David Müller",
          title: "Professional Coach",
          rating: 4.8,
          reviews: 156,
          image: "DM",
          displayOrder: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 16 },
        background: "linear-gradient(135deg, #f8fafc 0%, #eff2f7 100%)",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 10 } }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
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
                Top Coaches
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "44px" },
                  fontWeight: 800,
                  color: "#1a365d",
                  mb: 2,
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                MEET OUR TOP COACHES
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#64748b",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Learn from the best minds in racquet sports
              </Typography>
            </motion.div>
          </Box>


          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#ff7e00" }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: { xs: 3, md: 4 },
              }}
            >
              {coaches.length > 0 ? (
                coaches.map((coach, index) => (
                  <FeaturedCoachCard
                    key={coach.id || coach.coachId}
                    coach={coach}
                    index={index}
                  />
                ))
              ) : (
                <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8 }}>
                  <Typography sx={{ color: "#94a3b8" }}>
                    Featured coaches will appear here
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </motion.div>
      </Container>

    </Box>
  );
};

export default FeaturedCoachesSection;
