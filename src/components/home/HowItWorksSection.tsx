import { motion } from "framer-motion";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { Upload, MessageSquare, Play, TrendingUp } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Upload size={28} />,
      title: "Upload Your Video",
      description: "Record and upload your game footage in seconds",
      number: "01",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Get Expert Feedback",
      description: "Connect with professional coaches for analysis",
      number: "02",
    },
    {
      icon: <Play size={28} />,
      title: "Review Analysis",
      description: "Watch frame-by-frame breakdown with insights",
      number: "03",
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Track Progress",
      description: "Monitor your improvement over time",
      number: "04",
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
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                How It Works
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
                Simple Steps to Better Performance
              </Typography>
            </motion.div>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 3, md: 4 },
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    background: "white",
                    border: "2px solid #f0f4f8",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#ff7e00",
                      boxShadow: "0 16px 32px rgba(255, 126, 0, 0.12)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ position: "relative", mb: 3 }}>
                      <Typography
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: 0,
                          fontSize: "42px",
                          fontWeight: 800,
                          color: "rgba(255, 126, 0, 0.08)",
                        }}
                      >
                        {step.number}
                      </Typography>
                      <Box
                        sx={{
                          display: "inline-flex",
                          p: 2,
                          background: "linear-gradient(135deg, rgba(255, 126, 0, 0.12) 0%, rgba(255, 126, 0, 0.06) 100%)",
                          borderRadius: "12px",
                          color: "#ff7e00",
                          width: "56px",
                          height: "56px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.icon}
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#1a365d",
                        mb: 2,
                        fontSize: "18px",
                        fontFamily: '"Poppins", "Sora", sans-serif',
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "14px",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
