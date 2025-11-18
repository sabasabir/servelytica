
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SportSelectionPage from "./pages/SportSelectionPage";
import Index from "./pages/Index";
import UploadPage from "./pages/UploadPage";
import UploadCompletePage from "./pages/UploadCompletePage";
import Dashboard from "./pages/Dashboard";
import CoachesPage from "./pages/CoachesPage";
import SocialConnector from "./pages/SocialConnector";
import PricingPage from "./pages/PricingPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import CoachProfilePage from "./pages/CoachProfilePage";
import CoachDashboardPage from "./pages/CoachDashboardPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PlanSelectionPage from "./pages/PlanSelectionPage";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import MotionAnalysisPage from "./pages/MotionAnalysisPage";
import PrivateAnalysisSpace from "./pages/PrivateAnalysisSpace";
import PrivateAnalysisSession from "./pages/PrivateAnalysisSession";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<SportSelectionPage />} /> */}
            <Route path="/" element={<Index />} />
            {/* <Route path="/table-tennis" element={<Index />} />
            <Route path="/pickleball" element={<Index />} />
            <Route path="/badminton" element={<Index />} />
            <Route path="/tennis" element={<Index />} />
            <Route path="/squash" element={<Index />} /> */}
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/upload-complete" element={<UploadCompletePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/coaches/:username" element={<CoachProfilePage />} />
            <Route path="/coaches/:username/analysis" element={<UploadPage />} />
            <Route path="/connect" element={<SocialConnector />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/plan-selection" element={<PlanSelectionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/coach-dashboard" element={<CoachDashboardPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/following" element={<BlogPage />} />
            <Route path="/blog/latest" element={<BlogPage />} />
            <Route path="/blog/saved" element={<BlogPage />} />
            <Route path="/blog/create" element={<BlogPage />} />
            <Route path="/blog/post/:id" element={<BlogPostPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/motion-analysis" element={<MotionAnalysisPage />} />
            <Route path="/analysis-space" element={<PrivateAnalysisSpace />} />
            <Route path="/analysis-session/:sessionId" element={<PrivateAnalysisSession />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
