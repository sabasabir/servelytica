
import { Box, TextField, InputAdornment, Paper, Button, Typography, Chip } from "@mui/material";
import { Search } from "lucide-react";

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string;
  trendingTopics: string[];
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BlogCategories = ({
  categories,
  selectedCategory,
  trendingTopics,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: BlogCategoriesProps) => {
  return (
    <Paper
      sx={{
        borderRadius: "16px",
        border: "2px solid rgba(255, 126, 0, 0.15)",
        p: 3,
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 126, 0, 0.05) 100%)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        position: "sticky",
        top: 120,
      }}
    >
      {/* Search */}
      <TextField
        fullWidth
        placeholder="SEARCH ARTICLES..."
        value={searchQuery}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} style={{ color: "#ff7e00" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            background: "white",
            border: "2px solid rgba(255, 126, 0, 0.2)",
            "& fieldset": { border: "none" },
            "&:hover fieldset": { border: "none" },
            "&.Mui-focused fieldset": { border: "none" },
            "&.Mui-focused": { borderColor: "#ff7e00" },
          },
        }}
      />

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#1a365d",
            mb: 1.5,
            fontFamily: '"Poppins", "Sora", sans-serif',
            textTransform: "uppercase",
          }}
        >
          CATEGORIES
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => onCategoryChange(category)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "capitalize",
                color: selectedCategory === category ? "white" : "#1a365d",
                background:
                  selectedCategory === category
                    ? "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)"
                    : "transparent",
                fontWeight: selectedCategory === category ? 700 : 500,
                fontSize: "13px",
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    selectedCategory === category
                      ? "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)"
                      : "rgba(255, 126, 0, 0.1)",
                },
              }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Trending Topics */}
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#1a365d",
            mb: 1.5,
            fontFamily: '"Poppins", "Sora", sans-serif',
            textTransform: "uppercase",
          }}
        >
          TRENDING TOPICS
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {trendingTopics.map((topic, index) => (
            <Chip
              key={index}
              label={topic}
              sx={{
                background: "linear-gradient(135deg, rgba(255, 126, 0, 0.15) 0%, rgba(255, 126, 0, 0.05) 100%)",
                color: "#ff7e00",
                border: "1px solid rgba(255, 126, 0, 0.3)",
                fontWeight: 600,
                fontSize: "12px",
                textTransform: "capitalize",
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default BlogCategories;
