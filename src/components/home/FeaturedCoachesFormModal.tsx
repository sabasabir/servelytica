import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { FeaturedCoachService } from "@/services/featuredCoachService";
import { CoachService } from "@/services/coachService";

interface FeaturedCoachFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const FeaturedCoachesFormModal = ({
  open,
  onClose,
  onSave,
}: FeaturedCoachFormModalProps) => {
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [coachOptions, setCoachOptions] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCoachOptions();
    }
  }, [open]);

  const loadCoachOptions = async () => {
    setLoadingOptions(true);
    try {
      const coaches = await CoachService.getCoaches(100);
      setCoachOptions(coaches);
    } catch (err) {
      console.error("Error loading coaches:", err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSave = async () => {
    try {
      setError("");
      setLoading(true);

      if (!selectedCoach) {
        setError("Please select a coach");
        return;
      }

      if (!displayOrder || displayOrder < 1) {
        setError("Display order must be a positive number");
        return;
      }

      const coachId = selectedCoach.id?.toString() || selectedCoach.username;
      await FeaturedCoachService.addFeaturedCoach(
        coachId,
        displayOrder,
        new Date().toISOString()
      );

      onSave();
      setSelectedCoach(null);
      setDisplayOrder(1);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add featured coach");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Featured Coach</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack spacing={3}>
          <Autocomplete
            loading={loadingOptions}
            options={coachOptions}
            getOptionLabel={(option: any) => `${option.name} - ${option.title}`}
            value={selectedCoach}
            onChange={(_, value) => setSelectedCoach(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Coach"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            label="Display Order"
            type="number"
            fullWidth
            required
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1, max: 100 }}
            helperText="Lower numbers appear first (1-100)"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ background: "#ff7e00" }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Coach"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeaturedCoachesFormModal;
