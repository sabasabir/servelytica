import { motion } from "framer-motion";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { CheckCircle2, Zap, Users, BarChart3, Clock, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <CheckCircle2 size={32} />,
      title: "Detailed Analysis",
      description: "Frame-by-frame breakdown of your technique and strategy",
    },
    {
      icon: <Zap size={32} />,
      title: "AI-Powered Insights",
      description: "Machine learning technology identifies patterns and improvements",
    },
    {
      icon: <Users size={32} />,
      title: "Expert Coaches",
      description: "Access to certified coaches from around the world",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Progress Tracking",
      description: "Visualize your improvement with comprehensive statistics",
    },
    {
      icon: <Clock size={32} />,
      title: "Quick Turnaround",
      description: "Get feedback within 24 hours on most uploads",
    },
    {
      icon: <Shield size={32} />,
      title: "Secure & Private",
      description: "Your videos are encrypted and only visible to authorized people",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <motion.div variants={itemVariants}>
              <Typography
                sx={{
                  color: "#ff7e00",
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "1px",
                  mb: 2,
                }}
              >
                KEY BENEFITS
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "32px", md: "48px" },
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Why Choose Servelytica
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      p: 4,
                      background: "linear-gradient(135deg, rgba(255, 126, 0, 0.1) 0%, rgba(255, 126, 0, 0.05) 100%)",
                      border: "2px solid rgba(255, 126, 0, 0.2)",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        border: "2px solid rgba(255, 126, 0, 0.5)",
                        boxShadow: "0 20px 40px rgba(255, 126, 0, 0.2)",
                        background: "linear-gradient(135deg, rgba(255, 126, 0, 0.15) 0%, rgba(255, 126, 0, 0.1) 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mb: 3,
                        display: "inline-block",
                        p: 2,
                        background: "rgba(255, 126, 0, 0.2)",
                        borderRadius: "12px",
                        color: "#ff7e00",
                      }}
                    >
                      {benefit.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: "20px",
                      }}
                    >
                      {benefit.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BenefitsSection;
