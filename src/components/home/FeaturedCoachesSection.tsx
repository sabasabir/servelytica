import { motion } from "framer-motion";
import { Box, Container, Typography, Card, CardContent, Avatar } from "@mui/material";
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
                Top Coaches
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
                Meet Our Top Coaches
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
                Learn from the best minds in racquet sports
              </Typography>
            </motion.div>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 3, md: 4 },
            }}
          >
            {coaches.map((coach, index) => (
              <motion.div
                key={coach.id}
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
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#ff7e00",
                      boxShadow: "0 16px 32px rgba(255, 126, 0, 0.12)",
                    },
                  }}
                >
                  {/* Coach Avatar Section */}
                  <Box
                    sx={{
                      height: "180px",
                      background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        fontSize: "40px",
                        fontWeight: 700,
                        background: "rgba(255, 255, 255, 0.25)",
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
                        color: "#ff7e00",
                        fontSize: "13px",
                        fontWeight: 600,
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
                            size={14}
                            fill={i < Math.floor(coach.rating) ? "#ff7e00" : "rgba(255, 126, 0, 0.2)"}
                            color={i < Math.floor(coach.rating) ? "#ff7e00" : "rgba(255, 126, 0, 0.2)"}
                          />
                        ))}
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1a365d",
                          fontSize: "13px",
                        }}
                      >
                        {coach.rating}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "13px",
                        }}
                      >
                        ({coach.reviews})
                      </Typography>
                    </Box>
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

export default FeaturedCoachesSection;
