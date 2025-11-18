
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CoachCard from "./CoachCard";

const FeaturedCoachesSection = () => {
  const topCoaches = [
    {
      id: 1,
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Former National Champion",
      rating: 4.9,
      reviews: 124,
      specialties: ["Footwork", "Service", "Strategy"]
    },
    {
      id: 2,
      name: "Sarah Wong",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      title: "Olympic Medalist",
      rating: 5.0,
      reviews: 98,
      specialties: ["Backhand", "Loops", "Match Analysis"]
    },
    {
      id: 3,
      name: "David Müller",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      title: "Professional Coach",
      rating: 4.8,
      reviews: 156,
      specialties: ["Serve Return", "Technique", "Mental Game"]
    }
  ];

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-tt-blue mb-2">Meet Our Top Coaches</h2>
            <p className="text-lg text-gray-600">
              Learn from the best minds in table tennis
            </p>
          </div>
          <Link to="/coaches" className="mt-4 md:mt-0">
            <Button className="btn-secondary">
              View All Coaches
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topCoaches.map(coach => (
            <CoachCard key={coach.id} {...coach} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoachesSection;
