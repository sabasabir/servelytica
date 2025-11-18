
import { Card, CardContent } from "@/components/ui/card";
import PlayerCard, { Player } from "./PlayerCard";

interface PlayersListProps {
  players: Player[];
  userMembership: "Free" | "Advanced" | "Pro";
  onContactRequest: (player: Player) => void;
}

const PlayersList = ({ players, userMembership, onContactRequest }: PlayersListProps) => {
  return (
    <>
      {players.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, i) => (
            <PlayerCard 
              key={i} 
              player={player} 
              userMembership={userMembership} 
              onContactRequest={onContactRequest} 
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No players found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default PlayersList;
