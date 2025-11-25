
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoachSearch from "@/components/coaches/CoachSearch";
import CoachGrid from "@/components/coaches/CoachGrid";
import CoachFormModal from "@/components/coaches/CoachFormModal";
import { CoachService } from "@/services/coachService";
import { Coach } from "@/types/Coach";

const CoachesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedCoaches, setDisplayedCoaches] = useState<Coach[]>([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch coaches on component mount
  useEffect(() => {
    fetchCoaches();
  }, []); // Empty dependency array - only run once

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const fetchedCoaches = await CoachService.getCoaches(100);
      setCoaches(fetchedCoaches);
      setDisplayedCoaches(fetchedCoaches.slice(0, 9));
    } catch (error) {
      console.error("Error fetching coaches:", error);
      setError("Failed to load coaches");
    } finally {
      setLoading(false);
    }
  };

  // Filter coaches based on search and category
  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && coach.category === activeTab;
  });

  // Update displayed coaches when filters change
  useEffect(() => {
    setDisplayedCoaches(filteredCoaches.slice(0, 9));
  }, [searchQuery, activeTab, filteredCoaches]); // Dependencies are stable

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  const handleCreateNew = () => {
    setEditingCoach(null);
    setFormModalOpen(true);
  };

  const handleSaveCoach = async () => {
    await fetchCoaches();
    setFormModalOpen(false);
    setSuccess("Coach profile saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };


  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: "#ff7e00" }} />
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flex: 1, py: { xs: 8, md: 14 } }}>
        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 8, md: 10 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
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
                EXPERT GUIDANCE
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "48px" },
                  fontWeight: 800,
                  mb: 3,
                  color: "#1a365d",
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                OUR EXPERT COACHES
              </Typography>

              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#64748b",
                  maxWidth: "600px",
                  mb: 4,
                }}
              >
                Choose from our roster of professional coaches for personalized
                analysis and guidance
              </Typography>

              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={handleCreateNew}
                sx={{
                  background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "15px",
                }}
              >
                Add New Coach
              </Button>
            </Box>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: "32px" }}
          >
            <CoachSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </motion.div>

          {/* Coach Stats */}
          <Box
            sx={{
              mb: 4,
              p: 2,
              background: "linear-gradient(135deg, rgba(255, 126, 0, 0.08) 0%, rgba(255, 126, 0, 0.04) 100%)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 126, 0, 0.2)",
            }}
          >
            <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
              Showing {displayedCoaches.length} of {filteredCoaches.length} coaches
              {coaches.length > 0 ? ` (${coaches.length} total)` : ""}
            </Typography>
          </Box>

          {/* Coaches Grid */}
          <CoachGrid
            coaches={displayedCoaches}
            resetFilters={resetFilters}
          />
        </Container>
      </Box>

      {/* Form Modal */}
      <CoachFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveCoach}
        initialData={editingCoach}
        isEditing={!!editingCoach}
      />

      <Footer />
    </Box>
  );
};

export default CoachesPage;
