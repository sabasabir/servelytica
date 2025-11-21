import { motion } from "framer-motion";
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import { Star } from "lucide-react";

const FeaturedCoachesSection = () => {
  const coaches = [
    {
      id: 1,
      name: "Michael Chen",
      role: "Former National Champion",
      image: "MC",
      rating: 4.9,
      reviews: 124,
    },
    {
      id: 2,
      name: "Sarah Wong",
      role: "Olympic Medalist",
      image: "SW",
      rating: 5.0,
      reviews: 98,
    },
    {
      id: 3,
      name: "David Müller",
      role: "Professional Coach",
      image: "DM",
      rating: 4.8,
      reviews: 156,
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
                TOP COACHES
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
                Meet Our Top Coaches
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
                Learn from the best minds in racquet sports
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {coaches.map((coach, index) => (
              <Grid item xs={12} md={4} key={coach.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      background: "white",
                      border: "2px solid transparent",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#ff7e00",
                        boxShadow: "0 20px 40px rgba(255, 126, 0, 0.15)",
                      },
                    }}
                  >
                    {/* Coach Avatar Section */}
                    <Box
                      sx={{
                        height: "200px",
                        background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: "48px",
                          fontWeight: 700,
                          background: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                          border: "3px solid white",
                        }}
                      >
                        {coach.image}
                      </Avatar>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1a365d",
                          mb: 1,
                          fontSize: "18px",
                        }}
                      >
                        {coach.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "rgba(26, 54, 93, 0.6)",
                          fontSize: "14px",
                          mb: 3,
                        }}
                      >
                        {coach.role}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < Math.floor(coach.rating) ? "#ff7e00" : "rgba(255, 126, 0, 0.2)"}
                              color={i < Math.floor(coach.rating) ? "#ff7e00" : "rgba(255, 126, 0, 0.2)"}
                            />
                          ))}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1a365d",
                            fontSize: "14px",
                          }}
                        >
                          {coach.rating}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(26, 54, 93, 0.6)",
                            fontSize: "14px",
                          }}
                        >
                          ({coach.reviews} reviews)
                        </Typography>
                      </Box>
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

export default FeaturedCoachesSection;
