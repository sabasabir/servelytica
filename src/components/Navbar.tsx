import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Users, BookOpen, Brain } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar, Toolbar, IconButton, useScrollTrigger, Box, Typography } from '@mui/material';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    await signOut();
    navigate('/');
  };

  const navItems = [
    { to: "/", label: "Home" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ...(role !== 'coach' ? [{ to: "/coaches", label: "Coaches" }] : []),
    ...(role !== 'coach' ? [{ to: "/connect", label: "Connect", icon: Users }] : []),
    { to: "/blog", label: "Blog", icon: BookOpen },
    ...(user ? [
      { to: "/motion-analysis", label: "Motion Analysis", icon: Brain },
      { to: "/analysis-space", label: "Analysis Space", icon: Users }
    ] : []),
    ...(role !== 'coach' ? [
      { to: "/how-it-works", label: "How It Works" },
      { to: "/pricing", label: "Pricing" }
    ] : []),
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: trigger 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(255, 255, 255, 1)',
        backdropFilter: 'blur(10px)',
        boxShadow: trigger 
          ? '0 4px 12px rgba(26, 54, 93, 0.1)' 
          : '0 1px 3px rgba(26, 54, 93, 0.05)',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(26, 54, 93, 0.08)',
      }}
    >
      <Toolbar sx={{ maxWidth: '1280px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '64px' }}>
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  boxShadow: '0 4px 12px rgba(255, 126, 0, 0.3)',
                }}
              >
                <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>S</Typography>
              </motion.div>
              <Typography 
                sx={{ 
                  fontSize: { xs: '18px', md: '24px' },
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #1a365d 0%, #ff7e00 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                SERVELYTICA
              </Typography>
            </Link>
          </motion.div>
          
          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, overflow: 'auto' }}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  to={item.to}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    sx={{
                      fontSize: { md: '13px', lg: '15px' },
                      fontWeight: 600,
                      color: location.pathname === item.to ? '#ff7e00' : '#475569',
                      px: { md: 1.5, lg: 2 },
                      py: 1,
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        color: '#ff7e00',
                        background: 'rgba(255, 126, 0, 0.08)',
                      },
                      fontFamily: '"Poppins", "Sora", sans-serif',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              </motion.div>
            ))}
          </Box>

          {/* Auth Buttons & Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block"
              >
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Logout
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden lg:block"
                >
                  <Link to="/auth">
                    <Button size="sm" className="border-2 border-[#ff7e00] text-[#ff7e00] hover:bg-[#ff7e00] hover:text-white transition-all">LOGIN</Button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="hidden lg:block"
                >
                  <Link to="/auth">
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white"
                    >
                      SIGN UP
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              onClick={toggleMenu}
              sx={{ display: { xs: 'flex', lg: 'none' }, color: '#1a365d' }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(26, 54, 93, 0.08)',
            }}
          >
            <Box sx={{ px: 3, py: 4, display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#475569',
                      py: 1.5,
                      borderRadius: '8px',
                      fontFamily: '"Poppins", "Sora", sans-serif',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
              {user && (
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Logout
                </Button>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </AppBar>
  );
};

export default Navbar;
