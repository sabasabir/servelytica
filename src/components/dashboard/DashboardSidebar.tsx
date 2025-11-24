import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { LayoutDashboard, Package, ShoppingCart, ShoppingBag, Truck, BarChart3, Settings, Activity, HelpCircle, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  label: string;
  icon: any;
  onClick?: () => void;
}

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems: SidebarItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate("/dashboard") },
    { label: "My Items", icon: Package, onClick: () => navigate("/dashboard") },
    { label: "Marketplace", icon: ShoppingCart, onClick: () => navigate("/") },
    { label: "Orders", icon: ShoppingBag, onClick: () => navigate("/") },
    { label: "Shipping", icon: Truck, onClick: () => navigate("/") },
    { label: "Reports", icon: BarChart3, onClick: () => navigate("/") },
  ];

  const bottomMenuItems: SidebarItem[] = [
    { label: "Settings", icon: Settings, onClick: () => navigate("/") },
    { label: "Activity & Invitations", icon: Activity, onClick: () => navigate("/") },
    { label: "Help & Support", icon: HelpCircle, onClick: () => navigate("/") },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 220,
        background: "linear-gradient(180deg, #0f5f47 0%, #0d4d3a 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        position: "sticky",
        top: 0,
        overflow: "hidden",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Logo Section */}
      <Box sx={{ px: 3, mb: 4, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, #00ff88 0%, #00cc6f 100%)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 255, 136, 0.3)",
          }}
        >
          <Package size={16} style={{ color: "#0f5f47", fontWeight: 900 }} />
        </Box>
        <Typography
          sx={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 900,
            letterSpacing: "1.5px",
            fontFamily: '"Sora", sans-serif',
          }}
        >
          DASHBOARD
        </Typography>
      </Box>

      {/* Main Menu */}
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            component="button"
            onClick={item.onClick}
            sx={{
              mb: 1,
              borderRadius: "8px",
              color: "#a0a0a0",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: "10px 12px",
              "&:hover": {
                background: "rgba(0, 255, 136, 0.15)",
                color: "#00ff88",
                transform: "translateX(4px)",
              },
              "& .MuiListItemIcon-root": {
                minWidth: "40px",
                color: "inherit",
              },
            }}
          >
            <ListItemIcon>
              <item.icon size={18} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: '"Sora", sans-serif',
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Divider */}
      <Divider sx={{ background: "rgba(0, 255, 136, 0.2)", my: 2, mx: 2 }} />

      {/* Bottom Menu */}
      <Box sx={{ px: 2 }}>
        <List>
          {bottomMenuItems.map((item, index) => (
            <ListItem
              key={index}
              component="button"
              onClick={item.onClick}
              sx={{
                mb: 1,
                borderRadius: "8px",
                color: "#a0a0a0",
                transition: "all 0.3s",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: "10px 12px",
                "&:hover": {
                  background: "rgba(0, 255, 136, 0.15)",
                  color: "#00ff88",
                },
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: "inherit",
                },
              }}
            >
              <ListItemIcon>
                <item.icon size={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: '"Sora", sans-serif',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <ListItem
          component="button"
          onClick={handleLogout}
          sx={{
            mt: 3,
            borderRadius: "8px",
            color: "#ff6b6b",
            transition: "all 0.3s",
            cursor: "pointer",
            border: "none",
            background: "transparent",
            padding: "10px 12px",
            "&:hover": {
              background: "rgba(255, 107, 107, 0.15)",
            },
            "& .MuiListItemIcon-root": {
              minWidth: "40px",
              color: "inherit",
            },
          }}
        >
          <ListItemIcon>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Log Out"
            sx={{
              "& .MuiTypography-root": {
                fontSize: "13px",
                fontWeight: 500,
                fontFamily: '"Sora", sans-serif',
              },
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
