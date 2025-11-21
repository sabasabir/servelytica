

import { Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorksSection from "@/components/home/HowItWorksSection";

const HowItWorksPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <HowItWorksSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default HowItWorksPage;
