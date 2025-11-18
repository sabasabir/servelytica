
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const location = useLocation();
  const sport = location.pathname.substring(1).split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Determine which sport page we're on
  const isPickleball = location.pathname.includes('pickleball');
  const isBadminton = location.pathname.includes('badminton');
  const isTableTennis = location.pathname.includes('table-tennis');
  const isSquash = location.pathname.includes('squash');
  const isTennis = location.pathname.includes('tennis');

  // Define a background color based on sport
  let bgColorClass = "bg-tt-blue";
  let circleBgClass = "bg-white";
  let circleBorderClass = "border-white/20";
  
  if (isSquash) {
    bgColorClass = "bg-[#133042]";
  } else if (isTennis) {
    bgColorClass = "bg-tennis-navy";
  } else if (isBadminton) {
    bgColorClass = "bg-badminton-navy"; // Using the new darker navy color
    circleBgClass = "bg-white";
    circleBorderClass = "border-white/20"; // Consistent with other sports
  }

  // Get the correct logo based on sport
  let logoSrc = "";
  let logoAlt = "";
  
  if (isTableTennis) {
    logoSrc = "/lovable-uploads/e546ab71-dd97-4868-bedf-8c1932dd70a1.png";
    logoAlt = "Table Tennis Pro Logo";
  } else if (isPickleball) {
    logoSrc = "/lovable-uploads/40ac148e-891b-4a65-905b-49fff5e57bd6.png";
    logoAlt = "Pickleball Pro Logo";
  } else if (isBadminton) {
    logoSrc = "/lovable-uploads/ef99c0f2-7e85-4173-b03d-ca3765237363.png";
    logoAlt = "Badminton Pro Logo";
  } else if (isSquash) {
    logoSrc = "/lovable-uploads/53af569d-58c4-46eb-80a5-0f74107ba3e3.png";
    logoAlt = "Squash Pro Logo";
  } else if (isTennis) {
    logoSrc = "/lovable-uploads/325582fc-6e6a-4064-971e-cd321a50724e.png";
    logoAlt = "Tennis Pro Logo";
  }

  return (
    <section className={`relative text-white ${bgColorClass}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Elevate Your {sport} Game With Professional Analysis
            </h1>
            <p className="text-base md:text-lg mb-6 text-blue-100">
              Upload your matches and get personalized feedback from top coaches worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/upload">
                <Button className="btn-primary w-full sm:w-auto text-sm">
                  Upload Your Game
                </Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white text-tt-blue text-sm flex items-center gap-1">
                  Meet Our Coaches
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              {logoSrc && (
                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full ${circleBgClass} border-4 ${circleBorderClass} shadow-xl flex items-center justify-center p-0 overflow-hidden`}>
                  <img 
                    src={logoSrc} 
                    alt={logoAlt} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
