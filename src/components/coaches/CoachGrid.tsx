

import { Coach } from "@/types/Coach";
import DetailedCoachCard from "./DetailedCoachCard";
import EmptyCoachResults from "./EmptyCoachResults";
import { Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

interface CoachGridProps {
  coaches: Coach[];
  resetFilters: () => void;
  onDelete?: (coach: Coach) => void;
}

const CoachGrid = ({ coaches, resetFilters, onDelete }: CoachGridProps) => {
  if (coaches.length === 0) {
    return <EmptyCoachResults resetFilters={resetFilters} />;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
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
        >
          <DetailedCoachCard coach={coach} onDelete={onDelete} />
        </motion.div>
      ))}
    </Box>
  );
};

export default CoachGrid;
