
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface CoachCardProps {
  id: number;
  name: string;
  image: string;
  title: string;
  rating: number;
  reviews: number;
  specialties: string[];
}

const CoachCard = ({ id, name, image, title, rating, reviews, specialties }: CoachCardProps) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-gray-600 mb-3">{title}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map(specialty => (
              <span key={specialty} className="bg-gray-100 text-tt-blue text-sm px-3 py-1 rounded-full">
                {specialty}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{reviews} reviews</span>
            <Link to={`/coaches/${id}`}>
              <Button variant="outline" className="border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
