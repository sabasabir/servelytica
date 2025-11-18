
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoachSearch from "@/components/coaches/CoachSearch";
import CoachGrid from "@/components/coaches/CoachGrid";
import { CoachService } from "@/services/coachService";
import { Coach } from "@/types/Coach";

const CoachesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true);
      try {
        const fetchedCoaches = await CoachService.getCoaches();
        setCoaches(fetchedCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);
  
  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           coach.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && coach.category === activeTab;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading coaches...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-tt-blue mb-2">Our Expert Coaches</h1>
            <p className="text-gray-600">
              Choose from our roster of professional table tennis coaches for personalized analysis
            </p>
          </div>
          
          <CoachSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Coaches</TabsTrigger>
              <TabsTrigger value="elite">Elite Coaches</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="certified">Certified</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <CoachGrid coaches={filteredCoaches} resetFilters={resetFilters} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoachesPage;
