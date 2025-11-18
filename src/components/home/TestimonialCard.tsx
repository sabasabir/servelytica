
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  id: number;
  text: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ text, author, role }: TestimonialCardProps) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className="inline-block h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
          ))}
        </div>
        <p className="text-gray-700 mb-6 italic">"{text}"</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
