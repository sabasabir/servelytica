import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { LayoutDashboard, Package, ShoppingCart, ShoppingBag, Truck, BarChart3, Settings, Activity, HelpCircle, LogOut } from "lucide-react";
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
        width: 200,
        background: "linear-gradient(180deg, #0f5f47 0%, #0d4d3a 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography
          sx={{
            color: "#00ff88",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "2px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Package size={18} /> MANAGE
        </Typography>
      </Box>

      {/* Main Menu */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            component="button"
            onClick={item.onClick}
            sx={{
              mb: 0.5,
              borderRadius: "8px",
              color: "#a0a0a0",
              transition: "all 0.3s",
              "&:hover": {
                background: "rgba(0, 255, 136, 0.1)",
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
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Bottom Menu */}
      <Box sx={{ px: 1, borderTop: "1px solid rgba(0, 255, 136, 0.2)", pt: 2 }}>
        <List>
          {bottomMenuItems.map((item, index) => (
            <ListItem
              key={index}
              component="button"
              onClick={item.onClick}
              sx={{
                mb: 0.5,
                borderRadius: "8px",
                color: "#a0a0a0",
                transition: "all 0.3s",
                "&:hover": {
                  background: "rgba(0, 255, 136, 0.1)",
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
            mt: 2,
            borderRadius: "8px",
            color: "#ff6b6b",
            transition: "all 0.3s",
            "&:hover": {
              background: "rgba(255, 107, 107, 0.1)",
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
              },
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
