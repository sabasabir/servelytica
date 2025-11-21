
import { Box, Button, Paper, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";

interface Person {
  name: string;
  handle: string;
  avatar: string;
}

interface BlogSuggestionsProps {
  peopleToFollow: Person[];
}

const BlogSuggestions = ({ peopleToFollow }: BlogSuggestionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          borderRadius: "16px",
          border: "2px solid rgba(255, 126, 0, 0.15)",
          p: 3,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 126, 0, 0.05) 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#1a365d",
            mb: 2,
            fontFamily: '"Poppins", "Sora", sans-serif',
            textTransform: "uppercase",
          }}
        >
          WHO TO FOLLOW
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {peopleToFollow.map((person, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "10px",
                  background: "rgba(255, 126, 0, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 126, 0, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1a365d",
                        textTransform: "capitalize",
                      }}
                    >
                      {person.name}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>{person.handle}</Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    px: 1.5,
                    "&:hover": {
                      background: "linear-gradient(135deg, #ff6b00 0%, #ff8800 100%)",
                    },
                  }}
                >
                  Follow
                </Button>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default BlogSuggestions;
