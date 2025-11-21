import { motion } from "framer-motion";
import { Box, Container, Typography, Grid, Paper, Rating } from "@mui/material";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "The analysis I received was incredibly detailed. My coach spotted flaws in my technique that I never noticed myself. After implementing their suggestions, my game improved dramatically!",
      author: "Jennifer L.",
      role: "Amateur Player",
      rating: 5,
      initials: "JL",
    },
    {
      id: 2,
      text: "As a competitive player, I was looking for that edge to take my game to the next level. The professional analysis helped me refine my strategy against specific opponents.",
      author: "Marcus T.",
      role: "Regional Competitor",
      rating: 5,
      initials: "MT",
    },
    {
      id: 3,
      text: "I was skeptical at first, but the insights from my analysis were eye-opening. My coach provided drills specifically tailored to fix my weaknesses. Worth every penny!",
      author: "Aisha K.",
      role: "Club Player",
      rating: 5,
      initials: "AK",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)",
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
                TESTIMONIALS
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "44px" },
                  fontWeight: 700,
                  color: "#1a365d",
                  mb: 3,
                }}
              >
                What Our Players Say
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "rgba(26, 54, 93, 0.7)",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Hear from players who have transformed their game through professional analysis
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      p: 4,
                      background: "white",
                      border: "2px solid rgba(255, 126, 0, 0.1)",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        border: "2px solid rgba(255, 126, 0, 0.3)",
                        boxShadow: "0 20px 40px rgba(255, 126, 0, 0.1)",
                      },
                    }}
                  >
                    {/* Star Rating */}
                    <Box sx={{ mb: 3, display: "flex", gap: 0.5 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} fill="#ff7e00" color="#ff7e00" />
                      ))}
                    </Box>

                    {/* Testimonial Text */}
                    <Typography
                      sx={{
                        fontSize: "15px",
                        color: "rgba(26, 54, 93, 0.8)",
                        mb: 4,
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>

                    {/* Author */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "16px",
                        }}
                      >
                        {testimonial.initials}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1a365d",
                            fontSize: "15px",
                          }}
                        >
                          {testimonial.author}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "rgba(26, 54, 93, 0.6)",
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
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

export default TestimonialsSection;
