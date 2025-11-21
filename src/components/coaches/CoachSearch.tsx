
import { Box, TextField, InputAdornment, Paper } from "@mui/material";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface CoachSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CoachSearch = ({ searchQuery, setSearchQuery }: CoachSearchProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, rgba(255, 126, 0, 0.08) 0%, rgba(255, 126, 0, 0.04) 100%)",
          border: "2px solid rgba(255, 126, 0, 0.2)",
          borderRadius: "12px",
          p: 0,
        }}
      >
        <TextField
          fullWidth
          placeholder="SEARCH BY COACH NAME OR SPECIALTY..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} style={{ color: "#ff7e00" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none",
              fontSize: "15px",
              fontWeight: 600,
              color: "#1a365d",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "rgba(26, 54, 93, 0.5)",
              opacity: 1,
              fontWeight: 500,
            },
          }}
        />
      </Paper>
    </motion.div>
  );
};

export default CoachSearch;
