import { motion } from "framer-motion";
import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { Upload, Play, MessageSquare, TrendingUp } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Upload size={32} />,
      title: "Upload Your Video",
      description: "Record and upload your game footage in seconds",
      number: "01",
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Get Expert Feedback",
      description: "Connect with professional coaches for analysis",
      number: "02",
    },
    {
      icon: <Play size={32} />,
      title: "Review Analysis",
      description: "Watch frame-by-frame breakdown with insights",
      number: "03",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Track Progress",
      description: "Monitor your improvement over time",
      number: "04",
    },
  ];

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
                HOW IT WORKS
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "32px", md: "48px" },
                  fontWeight: 700,
                  color: "#1a365d",
                  mb: 3,
                }}
              >
                Simple Steps to Better Performance
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      background: "white",
                      border: "2px solid transparent",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#ff7e00",
                        boxShadow: "0 20px 40px rgba(255, 126, 0, 0.15)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #ff7e00 0%, #ff9500 100%)",
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.3s ease",
                      },
                      "&:hover::before": {
                        transform: "scaleX(1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          position: "relative",
                          mb: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            fontSize: "48px",
                            fontWeight: 700,
                            color: "rgba(255, 126, 0, 0.1)",
                            zIndex: 1,
                          }}
                        >
                          {step.number}
                        </Typography>
                        <Box
                          sx={{
                            display: "inline-block",
                            p: 2,
                            background: "linear-gradient(135deg, rgba(255, 126, 0, 0.1) 0%, rgba(255, 126, 0, 0.05) 100%)",
                            borderRadius: "12px",
                            color: "#ff7e00",
                            width: "56px",
                            height: "56px",
                            display: "flex",
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
                          fontSize: "20px",
                        }}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "rgba(26, 54, 93, 0.7)",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
