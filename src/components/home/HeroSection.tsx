import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Box, Container, Typography, Paper } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      component="section"
      sx={{
        background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        py: { xs: 10, md: 16 },
        minHeight: { xs: "auto", md: "80vh" },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.3fr" },
            gap: { xs: 6, md: 10 },
            alignItems: "center",
            rowGap: { xs: 8, md: 0 },
          }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "rgba(255, 126, 0, 0.15)",
                border: "1px solid rgba(255, 126, 0, 0.3)",
                borderRadius: "50px",
                marginBottom: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ff7e00",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                <Zap size={16} /> Professional Analysis Platform
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "32px", sm: "40px", md: "52px" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 4,
                  color: "#ffffff",
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                ELEVATE YOUR GAME WITH PROFESSIONAL ANALYSIS
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "16px", md: "17px" },
                  color: "#e0e7ff",
                  mb: 6,
                  lineHeight: 1.8,
                  maxWidth: "500px",
                }}
              >
                Upload your matches and get personalized feedback from top coaches worldwide. Improve faster with AI-powered insights and expert guidance.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              <Link to="/upload">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white hover:shadow-2xl"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      padding: "14px 32px",
                      boxShadow: "0 8px 24px rgba(255, 126, 0, 0.4)",
                    }}
                  >
                    Upload Your Game <ArrowRight size={20} style={{ marginLeft: "8px" }} />
                  </Button>
                </motion.div>
              </Link>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  style={{
                    border: "2px solid rgba(255, 126, 0, 0.6)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 600,
                    padding: "14px 32px",
                    background: "transparent",
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                borderRadius: "32px",
                overflow: "hidden",
                background: "linear-gradient(135deg, rgba(255, 126, 0, 0.15) 0%, rgba(255, 126, 0, 0.08) 100%)",
                border: "3px solid rgba(255, 126, 0, 0.3)",
                backdropFilter: "blur(10px)",
                aspectRatio: { xs: "4/3", md: "9/11" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: "320px", md: "580px" },
                backgroundImage: "url(/hero-video.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 25px 80px rgba(255, 126, 0, 0.25), 0 10px 40px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(26, 54, 93, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(255, 126, 0, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(255, 126, 0, 0.4)",
                  }}
                >
                  <Box
                    sx={{
                      width: 0,
                      height: 0,
                      borderLeft: "28px solid white",
                      borderTop: "18px solid transparent",
                      borderBottom: "18px solid transparent",
                      marginLeft: "4px",
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
