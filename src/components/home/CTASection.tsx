import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Container, Typography, Button as MuiButton } from "@mui/material";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 16 },
        background: "linear-gradient(135deg, #f8fafc 0%, #eff2f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: "center",
              background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
              borderRadius: "28px",
              p: { xs: 6, md: 12 },
              border: "2px solid rgba(255, 126, 0, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  mb: 3,
                  p: "8px 16px",
                  background: "rgba(255, 126, 0, 0.2)",
                  borderRadius: "50px",
                  border: "1px solid rgba(255, 126, 0, 0.3)",
                }}
              >
                <Typography
                  sx={{
                    color: "#ff7e00",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontFamily: '"Poppins", "Sora", sans-serif',
                  }}
                >
                  <Sparkles size={14} /> Limited Time Offer
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "48px" },
                  fontWeight: 800,
                  color: "white",
                  mb: 3,
                  lineHeight: 1.2,
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                READY TO TRANSFORM YOUR GAME?
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  color: "#e0e7ff",
                  mb: 6,
                  maxWidth: "700px",
                  mx: "auto",
                  lineHeight: 1.7,
                }}
              >
                Join thousands of players already improving their skills with professional analysis and expert coaching. Start your journey today!
              </Typography>

              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/upload">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white"
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        padding: "16px 36px",
                        boxShadow: "0 8px 24px rgba(255, 126, 0, 0.4)",
                      }}
                    >
                      Start Free Trial <ArrowRight size={20} style={{ marginLeft: "8px" }} />
                    </Button>
                  </motion.div>
                </Link>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MuiButton
                    size="large"
                    variant="outlined"
                    sx={{
                      border: "2px solid rgba(255, 126, 0, 0.6)",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 700,
                      padding: "14px 36px",
                      textTransform: "none",
                      "&:hover": {
                        border: "2px solid #ff7e00",
                        background: "rgba(255, 126, 0, 0.1)",
                      },
                    }}
                  >
                    Watch Demo
                  </MuiButton>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
