import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { DashboardService, DashboardItem } from "@/services/dashboardService";
import { DashboardItemModal } from "@/components/dashboard/DashboardItemModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ComprehensiveDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f0f4f8",
        }}
      >
        <CircularProgress sx={{ color: "#00ff88" }} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchItems();
  }, [user?.id]);

  const fetchItems = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await DashboardService.getDashboardItems(user.id);
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: DashboardItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await DashboardService.deleteDashboardItem(itemToDelete);
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete));
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleComplete = async (itemId: string) => {
    try {
      const updated = await DashboardService.updateDashboardItem(itemId, {
        status: "completed",
      });
      if (updated) {
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? updated : item))
        );
        toast({
          title: "Success",
          description: "Item marked as completed",
        });
      }
    } catch (error) {
      console.error("Error completing item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} />;
      case "in_progress":
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "#fbbf24",
      in_progress: "#3b82f6",
      completed: "#10b981",
      archived: "#9ca3af",
    };
    return colors[status] || "#6b7280";
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: "#10b981",
      medium: "#f59e0b",
      high: "#ef4444",
    };
    return colors[priority] || "#6b7280";
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <Box
          sx={{
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 900,
                color: "#0f5f47",
                fontFamily: '"Sora", "Poppins", sans-serif',
              }}
            >
              Dashboard
            </h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#94a3b8" }}>
              Manage your items and track progress
            </p>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              onClick={() => {}}
              className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-lg font-semibold"
            >
              <ChevronRight size={18} />
              Action
            </Button>
            <Button
              onClick={() => {}}
              className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold"
            >
              <ChevronRight size={18} />
              List Options
            </Button>
            <Button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-4 py-2 rounded-lg font-semibold"
            >
              <Plus size={18} />
              Add New
            </Button>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, padding: "30px 40px", overflowY: "auto" }}>
          {/* Search Bar */}
          <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: "8px" }} />,
              }}
              sx={{
                width: "350px",
                "& .MuiOutlinedInput-root": {
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "1px solid #0f5f47",
                  },
                },
              }}
            />
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#00ff88" }} />
            </Box>
          ) : filteredItems.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                background: "white",
                borderRadius: "12px",
              }}
            >
              <p style={{ color: "#9ca3af", fontSize: "16px" }}>
                No items found. Create one to get started!
              </p>
              <Button
                onClick={handleCreateNew}
                className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                <Plus size={18} className="mr-2" />
                Create First Item
              </Button>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", width: "40px" }}>
                      
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151" }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#374151", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                        "&:hover": { background: "#f9fafb" },
                        transition: "background 0.2s",
                      }}
                    >
                      <TableCell sx={{ textAlign: "center", color: getStatusColor(item.status) }}>
                        {getStatusIcon(item.status)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1f2937", maxWidth: "150px" }}>
                        {item.title}
                      </TableCell>
                      <TableCell sx={{ color: "#6b7280", maxWidth: "200px" }}>
                        {item.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            background: "rgba(0, 255, 136, 0.1)",
                            color: "#00ff88",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status.replace("_", " ")}
                          size="small"
                          sx={{
                            background: `${getStatusColor(item.status)}20`,
                            color: getStatusColor(item.status),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.priority}
                          size="small"
                          sx={{
                            background: `${getPriorityColor(item.priority)}20`,
                            color: getPriorityColor(item.priority),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#6b7280", fontSize: "13px" }}>
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ color: "#6b7280", fontSize: "13px" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          {item.status !== "completed" && (
                            <MuiButton
                              size="small"
                              onClick={() => handleComplete(item.id)}
                              sx={{
                                color: "#10b981",
                                minWidth: "32px",
                                padding: "4px",
                                "&:hover": { background: "rgba(16, 185, 129, 0.1)" },
                              }}
                              title="Mark Complete"
                            >
                              <CheckCircle2 size={18} />
                            </MuiButton>
                          )}
                          <MuiButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            sx={{
                              color: "#3b82f6",
                              minWidth: "32px",
                              padding: "4px",
                              "&:hover": { background: "rgba(59, 130, 246, 0.1)" },
                            }}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </MuiButton>
                          <MuiButton
                            size="small"
                            onClick={() => {
                              setItemToDelete(item.id);
                              setDeleteConfirmOpen(true);
                            }}
                            sx={{
                              color: "#ef4444",
                              minWidth: "32px",
                              padding: "4px",
                              "&:hover": { background: "rgba(239, 68, 68, 0.1)" },
                            }}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </MuiButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteConfirmOpen(false)}>Cancel</MuiButton>
          <MuiButton
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ background: "#ef4444" }}
          >
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Modal */}
      <DashboardItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchItems}
        item={selectedItem}
        userId={user?.id}
      />
    </Box>
  );
};

export default ComprehensiveDashboard;
