
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { CoachAchievement } from "@/types/CoachProfile";

interface PlayerCoachAchievementsProps {
  playerAchievements: CoachAchievement[];
  coachAchievements: CoachAchievement[];
  isEditing: boolean;
  onAddPlayerAchievement: () => void;
  onUpdatePlayerAchievement: (index: number, field: string, value: string) => void;
  onRemovePlayerAchievement: (index: number) => void;
  onAddCoachAchievement: () => void;
  onUpdateCoachAchievement: (index: number, field: string, value: string) => void;
  onRemoveCoachAchievement: (index: number) => void;
}

const PlayerCoachAchievements = ({
  playerAchievements,
  coachAchievements,
  isEditing,
  onAddPlayerAchievement,
  onUpdatePlayerAchievement,
  onRemovePlayerAchievement,
  onAddCoachAchievement,
  onUpdateCoachAchievement,
  onRemoveCoachAchievement
}: PlayerCoachAchievementsProps) => {
  
  const AchievementsList = ({
    achievements,
    onAdd,
    onUpdate,
    onRemove
  }: {
    achievements: CoachAchievement[];
    onAdd: () => void;
    onUpdate: (index: number, field: string, value: string) => void;
    onRemove: (index: number) => void;
  }) => (
    <div className="space-y-4">
      {isEditing && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onAdd}
          className="mb-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Achievement
        </Button>
      )}
      
      {achievements.length === 0 ? (
        <p className="text-center text-muted-foreground">No achievements added yet.</p>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="border rounded-md p-4 relative"
            >
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 p-1 h-auto"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
              
              {isEditing ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      value={achievement.year}
                      onChange={(e) => onUpdate(index, 'year', e.target.value)}
                      placeholder="Year"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={achievement.title}
                      onChange={(e) => onUpdate(index, 'title', e.target.value)}
                      placeholder="Achievement Title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={achievement.description}
                      onChange={(e) => onUpdate(index, 'description', e.target.value)}
                      placeholder="Brief Description"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{achievement.title}</span>
                    <span className="text-sm text-gray-500">{achievement.year}</span>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="player">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="player">As Player</TabsTrigger>
            <TabsTrigger value="coach">As Coach</TabsTrigger>
          </TabsList>
          
          <TabsContent value="player">
            <AchievementsList
              achievements={playerAchievements}
              onAdd={onAddPlayerAchievement}
              onUpdate={onUpdatePlayerAchievement}
              onRemove={onRemovePlayerAchievement}
            />
          </TabsContent>
          
          <TabsContent value="coach">
            <AchievementsList
              achievements={coachAchievements}
              onAdd={onAddCoachAchievement}
              onUpdate={onUpdateCoachAchievement}
              onRemove={onRemoveCoachAchievement}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlayerCoachAchievements;
