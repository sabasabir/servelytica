import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Users, LogIn, UserRound, BookOpen, Brain } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar, Toolbar, IconButton, useScrollTrigger } from '@mui/material';

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
    
    const currentPath = location.pathname;
    let redirectPath = '/';
    
    if (currentPath.includes('table-tennis')) {
      redirectPath = '/table-tennis';
    } else if (currentPath.includes('pickleball')) {
      redirectPath = '/pickleball';
    } else if (currentPath.includes('badminton')) {
      redirectPath = '/badminton';
    } else if (currentPath.includes('tennis')) {
      redirectPath = '/tennis';
    } else if (currentPath.includes('squash')) {
      redirectPath = '/squash';
    }
    
    navigate(redirectPath);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'white',
        boxShadow: trigger ? '0 2px 8px rgba(26, 54, 93, 0.08)' : '0 1px 2px rgba(26, 54, 93, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full h-16">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <motion.span 
                className="h-10 w-10 rounded-full bg-gradient-to-br from-tt-orange to-orange-500 flex items-center justify-center mr-2 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-white font-bold text-lg">S</span>
              </motion.span>
              <span className="text-2xl font-bold bg-gradient-to-r from-tt-blue to-tt-lightBlue bg-clip-text text-transparent">
                Servelytica
              </span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: "/", label: "Home" },
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
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  to={item.to} 
                  className="px-4 py-2 text-tt-blue hover:text-tt-orange transition-all duration-300 font-medium rounded-lg hover:bg-orange-50 flex items-center gap-1"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              </motion.div>
            ))}
            
            {user ? (
              <motion.div 
                className="flex items-center gap-2 ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      className="text-tt-blue hover:text-tt-orange hover:bg-orange-50"
                    >
                      <UserRound className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                  </motion.div>
                </Link>
                {role === 'player' && (
                  <Link to="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="bg-gradient-to-r from-tt-orange to-orange-500 text-white hover:shadow-lg transition-all duration-300"
                      >
                        My Videos
                      </Button>
                    </motion.div>
                  </Link>
                )}
                {role === 'coach' && (
                  <Link to="/coach-dashboard">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="bg-gradient-to-r from-tt-orange to-orange-500 text-white hover:shadow-lg transition-all duration-300"
                      >
                        Dashboard
                      </Button>
                    </motion.div>
                  </Link>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="border-2 border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white transition-all duration-300"
                  >
                    Logout
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center gap-2 ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/auth">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      className="text-tt-blue hover:text-tt-orange hover:bg-orange-50"
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Login
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/auth">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-tt-blue to-tt-lightBlue text-white hover:shadow-lg transition-all duration-300"
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <IconButton
              onClick={toggleMenu}
              className="text-tt-blue hover:text-tt-orange"
              sx={{ color: '#1a365d' }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </IconButton>
          </div>
        </div>
      </Toolbar>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">Home</Link>
              {role !== 'coach' && (
                <Link to="/coaches" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">Coaches</Link>
              )}
              {role !== 'coach' && (
                <Link to="/connect" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Connect
                  </span>
                </Link>
              )}
              <Link to="/blog" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Blog
                </span>
              </Link>
              {user && (
                <>
                  <Link to="/motion-analysis" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">
                    <span className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Motion Analysis
                    </span>
                  </Link>
                  <Link to="/analysis-space" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Analysis Space
                    </span>
                  </Link>
                </>
              )}
              {role !== 'coach' && (
                <>
                  <Link to="/how-it-works" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">How It Works</Link>
                  <Link to="/pricing" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">Pricing</Link>
                </>
              )}
              
              {user ? (
                <>
                  <Link to="/profile" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">
                    <span className="flex items-center">
                      <UserRound className="h-4 w-4 mr-2" />
                      Profile
                    </span>
                  </Link>
                  {role === 'player' && (
                    <Link to="/dashboard" className="block px-3 py-3">
                      <Button className="w-full bg-gradient-to-r from-tt-orange to-orange-500 text-white">
                        My Videos
                      </Button>
                    </Link>
                  )}
                  {role === 'coach' && (
                    <Link to="/coach-dashboard" className="block px-3 py-3">
                      <Button className="w-full bg-gradient-to-r from-tt-orange to-orange-500 text-white">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <div className="px-3 py-3">
                    <Button onClick={handleLogout} variant="outline" className="w-full border-2 border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block px-3 py-3 text-tt-blue hover:text-tt-orange hover:bg-orange-50 rounded-lg transition-all">
                    <span className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </span>
                  </Link>
                  <Link to="/auth" className="block px-3 py-3">
                    <Button className="w-full bg-gradient-to-r from-tt-blue to-tt-lightBlue text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppBar>
  );
};

export default Navbar;
