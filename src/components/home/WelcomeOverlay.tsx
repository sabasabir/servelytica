
import { useEffect, useState } from "react";

const WelcomeOverlay = () => {
  const [visible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show loading animation first, then display content after 1.5 seconds
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    // Hide welcome overlay after 6 seconds total
    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(contentTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-tt-blue bg-opacity-95 transition-opacity duration-500">
      <div className="text-center px-4">
        {!showContent ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-tt-orange border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl">Loading...</p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Servelytica</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Analyze, Elevate, Dominate
            </p>
            <p className="text-3xl md:text-4xl font-bold text-tt-orange animate-pulse">
              SERVE YOUR GAME
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeOverlay;
