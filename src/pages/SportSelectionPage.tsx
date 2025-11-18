
import { useState, useEffect } from "react";
import SportSelection from "@/components/SportSelection";
import WelcomeOverlay from "@/components/home/WelcomeOverlay";

const SportSelectionPage = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome overlay after 6 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showWelcome && <WelcomeOverlay />}
      <SportSelection />
    </div>
  );
};

export default SportSelectionPage;
