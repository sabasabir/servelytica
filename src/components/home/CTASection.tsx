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
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: "center",
              background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
              borderRadius: "24px",
              p: { xs: 6, md: 10 },
              border: "2px solid rgba(255, 126, 0, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "-50%",
                width: "200%",
                height: "100%",
                background: "radial-gradient(circle at 20% 50%, rgba(255, 126, 0, 0.1) 0%, transparent 50%)",
                animation: "float 15s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

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
                  }}
                >
                  <Sparkles size={14} /> Limited Time Offer
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "48px" },
                  fontWeight: 700,
                  color: "white",
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Ready to Transform Your Game?
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 6,
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Join thousands of players already improving their skills with professional analysis and expert coaching.
              </Typography>

              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
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
                        padding: "14px 36px",
                        color: "white",
                        boxShadow: "0 8px 24px rgba(255, 126, 0, 0.3)",
                      }}
                    >
                      Start Free Trial <ArrowRight size={18} style={{ marginLeft: "8px" }} />
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
                      border: "2px solid rgba(255, 126, 0, 0.5)",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 600,
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
