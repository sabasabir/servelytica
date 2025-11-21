import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const location = useLocation();
  const sport = location.pathname.substring(1).split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const isPickleball = location.pathname.includes('pickleball');
  const isBadminton = location.pathname.includes('badminton');
  const isTableTennis = location.pathname.includes('table-tennis');
  const isSquash = location.pathname.includes('squash');
  const isTennis = location.pathname.includes('tennis');

  let bgColorClass = "bg-gradient-to-br from-tt-blue via-tt-blue to-tt-lightBlue";
  let circleBgClass = "bg-white/10 backdrop-blur-sm";
  let circleBorderClass = "border-white/30";
  
  if (isSquash) {
    bgColorClass = "bg-gradient-to-br from-[#133042] via-[#1a4058] to-[#133042]";
  } else if (isTennis) {
    bgColorClass = "bg-gradient-to-br from-tennis-navy via-[#1a4058] to-tennis-navy";
  } else if (isBadminton) {
    bgColorClass = "bg-gradient-to-br from-badminton-navy via-[#2a3544] to-badminton-navy";
  }

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <section className={`relative text-white ${bgColorClass} overflow-hidden`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="z-10">
            <motion.div variants={itemVariants}>
              <motion.span
                className="inline-block px-4 py-2 bg-tt-orange/20 border border-tt-orange/30 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                🏆 Professional Analysis Platform
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Elevate Your{" "}
              <motion.span
                className="bg-gradient-to-r from-tt-orange to-orange-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {sport || "Game"}
              </motion.span>
              <br />
              With Professional Analysis
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed"
              variants={itemVariants}
            >
              Upload your matches and get personalized feedback from top coaches worldwide.
              Improve faster with AI-powered insights and expert guidance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link to="/upload">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-tt-orange to-orange-500 text-white hover:shadow-2xl hover:shadow-tt-orange/50 transition-all duration-300 text-base px-8 py-6 rounded-xl font-semibold w-full sm:w-auto">
                    <Play className="mr-2 h-5 w-5" />
                    Upload Your Game
                  </Button>
                </motion.div>
              </Link>
              <Link to="/coaches">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="border-2 border-white/80 text-white hover:bg-white hover:text-tt-blue backdrop-blur-sm transition-all duration-300 text-base px-8 py-6 rounded-xl font-semibold w-full sm:w-auto"
                  >
                    Meet Our Coaches
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-wrap gap-8 items-center"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-tt-orange to-orange-500 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-100">1000+ Athletes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm text-blue-100">4.9/5 Rating</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center relative"
            variants={imageVariants}
          >
            <div className="relative">
              {logoSrc && (
                <>
                  {/* Animated glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full blur-3xl ${circleBgClass}`}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className={`relative w-72 h-72 md:w-96 md:h-96 rounded-full ${circleBgClass} border-4 ${circleBorderClass} shadow-2xl flex items-center justify-center p-0 overflow-hidden backdrop-blur-md`}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.img
                      src={logoSrc}
                      alt={logoAlt}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>

                  {/* Floating elements around the logo */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-tt-orange rounded-full"
                      style={{
                        top: `${20 + i * 30}%`,
                        right: `${-10 + i * 5}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12 md:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="white"
            opacity="0.3"
          />
          <path
            d="M0,0V27.35a600.21,600.21,0,0,0,321.39,29.09c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
