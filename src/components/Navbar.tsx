import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Users, LogIn, UserRound, BookOpen, Brain } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    // Close the mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    await signOut();
    
    // Determine which sport page to redirect to based on current path
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
    
    // Redirect to the appropriate sport home page
    navigate(redirectPath);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="h-8 w-8 rounded-full bg-tt-orange flex items-center justify-center mr-2">
                <span className="text-white font-bold">S</span>
              </span>
              <span className="text-xl font-bold text-tt-blue">Servelytica</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">Home</Link>
            {role !== 'coach' && (
            <Link to="/coaches" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">Coaches</Link>
            )}
            {role !== 'coach' && (
            <Link to="/connect" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Connect
              </span>
            </Link>
            )}
            <Link to="/blog" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Blog
              </span>
            </Link>
            {user && (
              <>
                <Link to="/motion-analysis" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    Motion Analysis
                  </span>
                </Link>
                <Link to="/analysis-space" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Analysis Space
                  </span>
                </Link>
              </>
            )}
            {role !== 'coach' && (
            <Link to="/how-it-works" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">How It Works</Link>
            )}
            {role !== 'coach' && (
              <Link to="/pricing" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">Pricing</Link>
            )}
            
            {user ? (
              <>
                <Link to="/profile" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <UserRound className="h-4 w-4 mr-1" />
                    Profile
                  </span>
                </Link>
                {role === 'player' && (
                  <Link to="/dashboard" className="ml-2">
                    <Button variant="outline" className="border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white">
                      My Videos
                    </Button>
                  </Link>
                )}
                {role === 'coach' && (
                  <Link to="/coach-dashboard" className="ml-2">
                    <Button variant="outline" className="border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline" className="border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white ml-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" className="px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </span>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white ml-2">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-tt-blue hover:text-tt-orange focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            <Link to="/" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">Home</Link>
            <Link to="/coaches" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">Coaches</Link>
            <Link to="/connect" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Connect
              </span>
            </Link>
            <Link to="/blog" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Blog
              </span>
            </Link>
            {user && (
              <>
                <Link to="/motion-analysis" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    Motion Analysis
                  </span>
                </Link>
                <Link to="/analysis-space" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Analysis Space
                  </span>
                </Link>
              </>
            )}
            <Link to="/how-it-works" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">How It Works</Link>
            {role !== 'coach' && (
              <Link to="/pricing" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">Pricing</Link>
            )}
            
            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <UserRound className="h-4 w-4 mr-1" />
                    Profile
                  </span>
                </Link>
                {role === 'player' && (
                  <Link to="/dashboard" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">My Videos</Link>
                )}
                <Button onClick={handleLogout} className="w-full border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white mt-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" className="block px-3 py-2 text-tt-blue hover:text-tt-orange transition-colors">
                  <span className="flex items-center">
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </span>
                </Link>
                <Link to="/auth" className="block px-3 py-2 mt-2">
                  <Button variant="outline" className="w-full border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
