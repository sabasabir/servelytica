import { motion } from "framer-motion";
import { Box, Container, Typography, Paper } from "@mui/material";
import { CheckCircle2, Zap, Users, BarChart3, Clock, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <CheckCircle2 size={28} />,
      title: "Detailed Analysis",
      description: "Frame-by-frame breakdown of your technique and strategy",
    },
    {
      icon: <Zap size={28} />,
      title: "AI-Powered Insights",
      description: "Machine learning technology identifies patterns and improvements",
    },
    {
      icon: <Users size={28} />,
      title: "Expert Coaches",
      description: "Access to certified coaches from around the world",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Progress Tracking",
      description: "Visualize your improvement with comprehensive statistics",
    },
    {
      icon: <Clock size={28} />,
      title: "Quick Turnaround",
      description: "Get feedback within 24 hours on most uploads",
    },
    {
      icon: <Shield size={28} />,
      title: "Secure & Private",
      description: "Your videos are encrypted and only visible to authorized people",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 16 },
        background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
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
                }}
              >
                Key Benefits
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
                  mb: 2,
                }}
              >
                Why Choose Servelytica
              </Typography>
            </motion.div>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 3, md: 4 },
            }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 4,
                    background: "linear-gradient(135deg, rgba(255, 126, 0, 0.1) 0%, rgba(255, 126, 0, 0.05) 100%)",
                    border: "2px solid rgba(255, 126, 0, 0.15)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      border: "2px solid rgba(255, 126, 0, 0.4)",
                      boxShadow: "0 16px 32px rgba(255, 126, 0, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      display: "inline-flex",
                      p: 2,
                      background: "rgba(255, 126, 0, 0.2)",
                      borderRadius: "12px",
                      color: "#ff7e00",
                      width: "56px",
                      height: "56px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {benefit.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      fontSize: "18px",
                    }}
                  >
                    {benefit.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BenefitsSection;
