import { motion } from "framer-motion";
import { Box, Container, Typography, Paper, Grid2 } from "@mui/material";
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
      text: "As a competitive player, I was looking for that edge. The professional analysis helped me refine my strategy against specific opponents. Worth every penny!",
      author: "Marcus T.",
      role: "Regional Competitor",
      rating: 5,
      initials: "MT",
    },
    {
      id: 3,
      text: "I was skeptical at first, but the insights were eye-opening. My coach provided drills specifically tailored to fix my weaknesses. Highly recommended!",
      author: "Aisha K.",
      role: "Club Player",
      rating: 5,
      initials: "AK",
    },
  ];

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
                }}
              >
                Testimonials
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
                }}
              >
                What Our Players Say
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
                Hear from players who have transformed their game
              </Typography>
            </motion.div>
          </Box>

          <Grid2 container spacing={{ xs: 3, md: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid2 xs={12} md={4} key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      p: 4,
                      background: "white",
                      border: "2px solid #f0f4f8",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        border: "2px solid #ff7e00",
                        boxShadow: "0 16px 32px rgba(255, 126, 0, 0.1)",
                      },
                    }}
                  >
                    {/* Star Rating */}
                    <Box sx={{ mb: 4, display: "flex", gap: 0.5 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#ff7e00" color="#ff7e00" />
                      ))}
                    </Box>

                    {/* Testimonial Text */}
                    <Typography
                      sx={{
                        fontSize: "15px",
                        color: "#475569",
                        mb: 4,
                        lineHeight: 1.7,
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
                          flexShrink: 0,
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
                            color: "#94a3b8",
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
