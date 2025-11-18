
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock, MapPin, MessageCircle } from "lucide-react";

// Define the player type
export type Player = {
  id: number;
  name: string;
  level: string;
  location: string;
  distance: string;
  rating: number;
  playStyle: string;
  image: string;
};

interface PlayerCardProps {
  player: Player;
  userMembership: "Free" | "Advanced" | "Pro";
  onContactRequest: (player: Player) => void;
}

const PlayerCard = ({ player, userMembership, onContactRequest }: PlayerCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Avatar className="h-12 w-12">
            <AvatarImage src={player.image} alt={player.name} />
            <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            Rating: {player.rating}
          </div>
        </div>
        <CardTitle className="mt-4">{player.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" /> 
          {player.location} • {player.distance}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {player.level}
          </span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {player.playStyle}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className={`w-full text-tt-blue border-tt-blue ${
            userMembership === "Free" ? 'relative group' : 'hover:bg-tt-blue hover:text-white'
          }`}
          onClick={() => onContactRequest(player)}
        >
          {/* {userMembership === "Free" && (
            <Lock className="absolute left-2 h-4 w-4 text-tt-blue" />
          )} */}
          <MessageCircle className="mr-2 h-4 w-4" /> Connect
          {userMembership === "Free" && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Advanced or Pro required
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;
