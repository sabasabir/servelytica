import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { PrivateAnalysisService } from "@/services/privateAnalysisService";

interface SessionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (session: any) => void;
  initialData?: any;
  isEditing?: boolean;
  studentId?: string;
  coachId?: string;
}

const SESSION_TYPES = [
  { value: 'video_analysis', label: 'Video Analysis' },
  { value: 'technique_review', label: 'Technique Review' },
  { value: 'match_review', label: 'Match Review' },
  { value: 'training_plan', label: 'Training Plan' },
];

const SESSION_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const SessionFormModal = ({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
  studentId,
  coachId,
}: SessionFormModalProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    session_type: initialData?.session_type || "video_analysis",
    status: initialData?.status || "draft",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setError("");
      setLoading(true);

      if (!formData.title.trim()) {
        setError("Session title is required");
        return;
      }

      if (isEditing && initialData?.id) {
        // Update session status/info
        const success = await PrivateAnalysisService.updateSessionStatus(
          initialData.id,
          formData.status
        );
        if (!success) {
          throw new Error("Failed to update session");
        }
      } else if (coachId && studentId) {
        // Create new session
        const session = await PrivateAnalysisService.createSession(
          coachId,
          studentId,
          formData.title,
          formData.description || undefined,
          formData.session_type
        );
        if (!session) {
          throw new Error("Failed to create session");
        }
      }

      onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Edit Analysis Session" : "Create Analysis Session"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack spacing={3}>
          <TextField
            label="Session Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Forehand Technique Review"
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Optional description of the session"
          />

          <FormControl fullWidth>
            <InputLabel>Session Type</InputLabel>
            <Select
              value={formData.session_type}
              label="Session Type"
              onChange={(e) =>
                setFormData({ ...formData, session_type: e.target.value })
              }
            >
              {SESSION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              {SESSION_STATUSES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default SessionFormModal;
