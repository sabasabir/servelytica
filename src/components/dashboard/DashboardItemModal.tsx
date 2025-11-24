import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TextField, Button, Select, MenuItem } from "@mui/material";
import { DashboardService } from "@/services/dashboardService";

interface DashboardItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  item?: any;
  userId?: string;
}

export const DashboardItemModal = ({
  open,
  onClose,
  onSave,
  item,
  userId,
}: DashboardItemModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("task");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || "");
      setType(item.type);
      setStatus(item.status);
      setPriority(item.priority);
      setDueDate(item.dueDate || "");
    } else {
      resetForm();
    }
  }, [item, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("task");
    setStatus("pending");
    setPriority("medium");
    setDueDate("");
    setError("");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      if (item?.id) {
        await DashboardService.updateDashboardItem(item.id, {
          title,
          description,
          type: type as any,
          status: status as any,
          priority: priority as any,
          dueDate,
        });
      } else {
        await DashboardService.createDashboardItem({
          userId: userId!,
          title,
          description,
          type: type as any,
          status: status as any,
          priority: priority as any,
          dueDate,
        });
      }
      onSave();
      resetForm();
      onClose();
    } catch (err) {
      setError((err as any).message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? "Edit Item" : "Create New Item"}</DialogTitle>
      <DialogContent sx={{ pt: 2, space: 2 }}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />

          <Select value={type} onChange={(e) => setType(e.target.value)} fullWidth>
            <MenuItem value="task">Task</MenuItem>
            <MenuItem value="goal">Goal</MenuItem>
            <MenuItem value="note">Note</MenuItem>
            <MenuItem value="achievement">Achievement</MenuItem>
          </Select>

          <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>

          <Select value={priority} onChange={(e) => setPriority(e.target.value)} fullWidth>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardItemModal;
