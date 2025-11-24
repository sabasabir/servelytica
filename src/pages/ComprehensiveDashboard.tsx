import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Plus,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DashboardService, DashboardItem } from "@/services/dashboardService";
import { DashboardItemCard } from "@/components/dashboard/DashboardItemCard";
import { DashboardItemModal } from "@/components/dashboard/DashboardItemModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ComprehensiveDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    completedItems: 0,
    inProgressItems: 0,
  });
  const [tabValue, setTabValue] = useState(0);

  if (authLoading) {
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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  const fetchDashboard = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [itemsData, statsData] = await Promise.all([
        DashboardService.getDashboardItems(user.id),
        DashboardService.getDashboardStats(user.id),
      ]);
      setItems(itemsData || []);
      setStats(statsData || { totalItems: 0, completedItems: 0, inProgressItems: 0 });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: DashboardItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    try {
      await DashboardService.deleteDashboardItem(itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleComplete = async (itemId: string) => {
    try {
      const updated = await DashboardService.updateDashboardItem(itemId, {
        status: "completed",
      });
      if (updated) {
        setItems((prevItems) =>
          prevItems.map((i) => (i.id === itemId ? updated : i))
        );
        await fetchDashboard();
      }
    } catch (error) {
      console.error("Error completing item:", error);
    }
  };

  const filteredItems = {
    all: items,
    pending: items.filter((i) => i.status === "pending"),
    in_progress: items.filter((i) => i.status === "in_progress"),
    completed: items.filter((i) => i.status === "completed"),
  };

  const getTabItems = () => {
    const tabs = ["all", "pending", "in_progress", "completed"];
    return filteredItems[tabs[tabValue] as keyof typeof filteredItems];
  };

  const StatCard = ({ icon: Icon, label, value, gradient }: any) => (
    <MuiCard sx={{ background: gradient, color: "white", mb: 3 }}>
      <MuiCardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Icon size={32} />
          <Box>
            <Typography sx={{ fontSize: "12px", opacity: 0.9 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: "28px", fontWeight: 800 }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </MuiCardContent>
    </MuiCard>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1a365d",
              mb: 1,
              fontFamily: '"Poppins", "Sora", sans-serif',
            }}
          >
            My Dashboard
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "16px" }}>
            Manage your goals, tasks, and progress
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 2,
            mb: 6,
          }}
        >
          <StatCard
            icon={BarChart3}
            label="Total Items"
            value={stats.totalItems}
            gradient="linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completedItems}
            gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={stats.inProgressItems}
            gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
          />
          <StatCard
            icon={AlertCircle}
            label="Pending"
            value={items.filter((i) => i.status === "pending").length}
            gradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
          />
        </Box>

        {/* Items Section */}
        <Card sx={{ mb: 6 }}>
          <CardHeader>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CardTitle>Your Items</CardTitle>
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </Box>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#ff7e00" }} />
              </Box>
            ) : (
              <>
                <Tabs
                  value={tabValue}
                  onChange={(_, value) => setTabValue(value)}
                  sx={{ mb: 3, borderBottom: "1px solid #e2e8f0" }}
                >
                  <Tab label={`All (${filteredItems.all.length})`} />
                  <Tab label={`Pending (${filteredItems.pending.length})`} />
                  <Tab
                    label={`In Progress (${filteredItems.in_progress.length})`}
                  />
                  <Tab label={`Completed (${filteredItems.completed.length})`} />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  {getTabItems().length > 0 ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        gap: 3,
                      }}
                    >
                      {getTabItems().map((item) => (
                        <DashboardItemCard
                          key={item.id}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onComplete={handleComplete}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography sx={{ color: "#94a3b8", mb: 2 }}>
                        No items yet. Create one to get started!
                      </Typography>
                      <Button onClick={handleCreateNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Item
                      </Button>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {getTabItems().length > 0 ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        gap: 3,
                      }}
                    >
                      {getTabItems().map((item) => (
                        <DashboardItemCard
                          key={item.id}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onComplete={handleComplete}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography sx={{ color: "#94a3b8" }}>
                        No pending items
                      </Typography>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {getTabItems().length > 0 ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        gap: 3,
                      }}
                    >
                      {getTabItems().map((item) => (
                        <DashboardItemCard
                          key={item.id}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onComplete={handleComplete}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography sx={{ color: "#94a3b8" }}>
                        No items in progress
                      </Typography>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  {getTabItems().length > 0 ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        gap: 3,
                      }}
                    >
                      {getTabItems().map((item) => (
                        <DashboardItemCard
                          key={item.id}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onComplete={handleComplete}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography sx={{ color: "#94a3b8" }}>
                        No completed items yet
                      </Typography>
                    </Box>
                  )}
                </TabPanel>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <DashboardItemModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={fetchDashboard}
          item={selectedItem}
          userId={user?.id}
        />
      </Container>

      <Footer />
    </Box>
  );
};

export default ComprehensiveDashboard;
