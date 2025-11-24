import { Card as MuiCard, CardContent as MuiCardContent, Box, Typography, Chip, Button, Rating, IconButton } from "@mui/material";
import { Star, Clock, MapPin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Coach } from "@/types/Coach";
import { motion } from "framer-motion";

interface DetailedCoachCardProps {
  coach: Coach;
  onDelete?: (coach: Coach) => void;
}

const DetailedCoachCard = ({ coach, onDelete }: DetailedCoachCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(255, 126, 0, 0.25)" }}
      transition={{ duration: 0.3 }}
    >
      <MuiCard
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          border: "2px solid rgba(255, 126, 0, 0.15)",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 126, 0, 0.05) 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 60px rgba(255, 126, 0, 0.25)",
            borderColor: "rgba(255, 126, 0, 0.4)",
            transform: "translateY(-8px)",
          },
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "220px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #1a365d 0%, #2d5a8c 100%)",
          }}
        >
          <img
            src={coach.image}
            alt={coach.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
            }}
          />

          {/* Rating Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
              borderRadius: "12px",
              p: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              boxShadow: "0 4px 12px rgba(255, 126, 0, 0.4)",
            }}
          >
            <Star size={16} color="white" fill="white" />
            <Typography sx={{ color: "white", fontWeight: 700, fontSize: "14px" }}>
              {coach.rating}
            </Typography>
          </Box>

          {/* Elite Coach Badge */}
          {coach.category === "elite" && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "linear-gradient(135deg, #1a365d 0%, #2d5a8c 100%)",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#ff7e00",
                  fontWeight: 800,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Elite Coach
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Container */}
        <MuiCardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
          {/* Coach Name & Title */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#1a365d",
                mb: 0.5,
                fontFamily: '"Poppins", "Sora", sans-serif',
                textTransform: "capitalize",
              }}
            >
              {coach.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                textTransform: "capitalize",
              }}
            >
              {coach.title}
            </Typography>
          </Box>

          {/* Response Time & Reviews */}
          <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={14} color="#ff7e00" />
              <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                {coach.responseTime}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
              •
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
              {coach.reviews} reviews
            </Typography>
          </Box>

          {/* Specialties */}
          <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {coach.specialties.slice(0, 2).map(specialty => (
              <Chip
                key={specialty}
                label={specialty}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, rgba(255, 126, 0, 0.15) 0%, rgba(255, 126, 0, 0.05) 100%)",
                  color: "#ff7e00",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  border: "1px solid rgba(255, 126, 0, 0.3)",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ))}
          </Box>

          {/* Experience */}
          <Typography
            sx={{
              fontSize: "12px",
              color: "#94a3b8",
              fontWeight: 500,
              mb: 3,
              flex: 1,
            }}
          >
            {coach.experience} experience
          </Typography>

          {/* Buttons Container */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* View Profile Button */}
            <Link to={`/coaches/${coach.username}`} style={{ textDecoration: "none", flex: 1 }}>
              <Button
                fullWidth
                sx={{
                  background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "13px",
                  textTransform: "uppercase",
                  py: 1.2,
                  borderRadius: "10px",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ff6b00 0%, #ff8800 100%)",
                    boxShadow: "0 8px 20px rgba(255, 126, 0, 0.4)",
                  },
                }}
              >
                VIEW PROFILE
              </Button>
            </Link>

            {/* Delete Button */}
            {onDelete && (
              <IconButton
                onClick={() => onDelete(coach)}
                sx={{
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  py: 1.2,
                  px: 1.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.15) 100%)",
                  },
                }}
              >
                <Trash2 size={18} />
              </IconButton>
            )}
          </Box>
        </MuiCardContent>
      </MuiCard>
    </motion.div>
  );
};

export default DetailedCoachCard;
