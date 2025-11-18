
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Coach } from "@/types/Coach";

interface DetailedCoachCardProps {
  coach: Coach;
}

const DetailedCoachCard = ({ coach }: DetailedCoachCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={coach.image} 
            alt={coach.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-semibold">{coach.rating}</span>
          </div>
          {coach.category === "elite" && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-tt-orange text-white">Elite Coach</Badge>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold">{coach.name}</h3>
              <p className="text-gray-600">{coach.title}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>Response time: {coach.responseTime}</span>
            <span className="mx-2">•</span>
            <span>{coach.reviews} reviews</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {coach.specialties.map(specialty => (
              <span key={specialty} className="bg-gray-100 text-tt-blue text-sm px-3 py-1 rounded-full">
                {specialty}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{coach.experience} experience</span>
            <Link to={`/coaches/${coach.username}`}>
              <Button className="bg-tt-blue text-white hover:bg-blue-800">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedCoachCard;
