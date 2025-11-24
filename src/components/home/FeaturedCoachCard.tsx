import { motion } from "framer-motion";
import { Box, Card, CardContent, Typography, Avatar, IconButton } from "@mui/material";
import { Star, Trash2 } from "lucide-react";

interface FeaturedCoachCardProps {
  coach: any;
  index: number;
  onDelete?: (coachId: string) => void;
}

const FeaturedCoachCard = ({ coach, index, onDelete }: FeaturedCoachCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
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
          position: "relative",
          "&:hover": {
            borderColor: "#ff7e00",
            boxShadow: "0 16px 32px rgba(255, 126, 0, 0.12)",
          },
        }}
      >
        {/* Delete Button */}
        {onDelete && (
          <IconButton
            onClick={() => onDelete(coach.id || coach.coachId)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              zIndex: 10,
              "&:hover": {
                background: "rgba(239, 68, 68, 0.2)",
              },
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        )}

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
            src={coach.image}
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
            {getInitials(coach.name)}
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
              fontFamily: '"Poppins", "Sora", sans-serif',
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
            {coach.title || coach.role}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={
                    i < Math.floor(coach.rating) ? "#ff7e00" : "rgba(255, 126, 0, 0.2)"
                  }
                  color={
                    i < Math.floor(coach.rating) ? "#ff7e00" : "rgba(255, 126, 0, 0.2)"
                  }
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
              {coach.rating || "4.8"}
            </Typography>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              ({coach.reviews || "120"})
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeaturedCoachCard;
