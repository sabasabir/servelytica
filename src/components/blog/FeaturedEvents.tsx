
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FeaturedEvents = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-gray-700">Featured Events</h3>
        <div className="space-y-3">
          <div className="border rounded-md p-3">
            <p className="font-medium text-sm">World Table Tennis Championships</p>
            <p className="text-xs text-gray-500 mb-2">May 15-22, 2025 • Paris, France</p>
            <Button size="sm" variant="outline" className="w-full text-xs border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white">
              Learn More
            </Button>
          </div>
          <div className="border rounded-md p-3">
            <p className="font-medium text-sm">PingPros Summer Camp</p>
            <p className="text-xs text-gray-500 mb-2">July 10-15, 2025 • New York, USA</p>
            <Button size="sm" variant="outline" className="w-full text-xs border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white">
              Register Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedEvents;
