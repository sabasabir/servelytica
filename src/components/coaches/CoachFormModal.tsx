import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import { CoachService } from "@/services/coachService";

interface CoachFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (coach: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const CoachFormModal = ({ open, onClose, onSave, initialData, isEditing }: CoachFormModalProps) => {
  const [formData, setFormData] = useState({
    yearsCoaching: initialData?.yearsCoaching || 0,
    coachingPhilosophy: initialData?.coachingPhilosophy || "",
    ratePerHour: initialData?.ratePerHour || "",
    currency: initialData?.currency || "USD",
    certifications: initialData?.certifications || [],
    languages: initialData?.languages || [],
    verified: initialData?.verified || false,
  });

  const [newCert, setNewCert] = useState("");
  const [newLang, setNewLang] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCertification = () => {
    if (newCert.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCert.trim()],
      });
      setNewCert("");
    }
  };

  const handleAddLanguage = () => {
    if (newLang.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLang.trim()],
      });
      setNewLang("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_: any, i: number) => i !== index),
    });
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      setError("");
      setLoading(true);

      if (!formData.coachingPhilosophy.trim()) {
        setError("Coaching philosophy is required");
        return;
      }

      const dataToSave = {
        ...formData,
        yearsCoaching: parseInt(formData.yearsCoaching.toString()) || 0,
        ratePerHour: formData.ratePerHour ? parseFloat(formData.ratePerHour.toString()) : null,
      };

      if (isEditing && initialData?.userId) {
        await CoachService.updateCoachProfile(initialData.userId, dataToSave);
      } else {
        // Create mode - but this would need userId from context
        await CoachService.createCoachProfile(dataToSave);
      }

      onSave(dataToSave);
      setFormData({
        yearsCoaching: 0,
        coachingPhilosophy: "",
        ratePerHour: "",
        currency: "USD",
        certifications: [],
        languages: [],
        verified: false,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save coach profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Edit Coach Profile" : "Create Coach Profile"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack spacing={3}>
          <TextField
            label="Coaching Philosophy"
            multiline
            rows={3}
            fullWidth
            value={formData.coachingPhilosophy}
            onChange={(e) =>
              setFormData({ ...formData, coachingPhilosophy: e.target.value })
            }
          />

          <TextField
            label="Years of Coaching"
            type="number"
            fullWidth
            value={formData.yearsCoaching}
            onChange={(e) =>
              setFormData({ ...formData, yearsCoaching: parseInt(e.target.value) || 0 })
            }
          />

          <TextField
            label="Rate Per Hour"
            type="number"
            fullWidth
            value={formData.ratePerHour}
            onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
          />

          <TextField
            label="Currency"
            fullWidth
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          />

          <Box>
            <TextField
              label="Add Certification"
              fullWidth
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCertification()}
            />
            <Button
              onClick={handleAddCertification}
              variant="outlined"
              sx={{ mt: 1 }}
              size="small"
            >
              Add Certification
            </Button>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {formData.certifications.map((cert: string, idx: number) => (
                <Chip
                  key={idx}
                  label={cert}
                  onDelete={() => handleRemoveCertification(idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Box>
            <TextField
              label="Add Language"
              fullWidth
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLanguage()}
            />
            <Button
              onClick={handleAddLanguage}
              variant="outlined"
              sx={{ mt: 1 }}
              size="small"
            >
              Add Language
            </Button>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {formData.languages.map((lang: string, idx: number) => (
                <Chip
                  key={idx}
                  label={lang}
                  onDelete={() => handleRemoveLanguage(idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
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
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoachFormModal;
