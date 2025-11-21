import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Box, Container, Typography, Paper } from "@mui/material";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 6,
              alignItems: "center",
            }}
          >
            {/* Left Content */}
            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
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
                  }}
                >
                  <Zap size={16} /> Professional Analysis Platform
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "32px", sm: "40px", md: "52px" },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                    background: "linear-gradient(135deg, #fff 0%, #ff7e00 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Elevate Your Game With Professional Analysis
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "16px", md: "18px" },
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Upload your matches and get personalized feedback from top coaches worldwide. Improve faster with AI-powered insights and expert guidance.
                </Typography>
              </motion.div>

              <motion.div
                variants={itemVariants}
                style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
              >
                <Link to="/upload">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#ff7e00] to-[#ff9500] hover:shadow-lg"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        padding: "12px 32px",
                        color: "white",
                        boxShadow: "0 8px 24px rgba(255, 126, 0, 0.3)",
                      }}
                    >
                      Upload Your Game <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                    </Button>
                  </motion.div>
                </Link>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    style={{
                      border: "2px solid rgba(255, 126, 0, 0.5)",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 600,
                      padding: "12px 32px",
                    }}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              variants={imageVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, rgba(255, 126, 0, 0.1) 0%, rgba(255, 126, 0, 0.05) 100%)",
                  border: "2px solid rgba(255, 126, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    color: "rgba(255, 126, 0, 0.5)",
                    fontWeight: 600,
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  🎥 Your Analysis Journey Starts Here
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
