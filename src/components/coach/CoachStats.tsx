
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Users, Award, BarChart3 } from "lucide-react";
import { CoachExperience } from "@/types/CoachProfile";

interface CoachStatsProps {
  experience: CoachExperience;
  isEditing: boolean;
  editedExperience: CoachExperience;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoachStats = ({
  experience,
  isEditing,
  editedExperience,
  handleChange
}: CoachStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coaching Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearsPlaying">Years Playing</Label>
              <Input
                id="yearsPlaying"
                name="experience.yearsPlaying"
                type="number"
                value={editedExperience.yearsPlaying}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsCoaching">Years Coaching</Label>
              <Input
                id="yearsCoaching"
                name="experience.yearsCoaching"
                type="number"
                value={editedExperience.yearsCoaching}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analysisCompleted">Video Analysis Completed</Label>
              <Input
                id="analysisCompleted"
                name="experience.analysisCompleted"
                type="number"
                value={editedExperience.analysisCompleted}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activePlayers">Active Players</Label>
              <Input
                id="activePlayers"
                name="experience.activePlayers"
                type="number"
                value={editedExperience.activePlayers}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Years Playing</p>
                <p className="text-2xl font-bold">{experience.yearsPlaying}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-lg">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Years Coaching</p>
                <p className="text-2xl font-bold">{experience.yearsCoaching}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Analyses Completed</p>
                <p className="text-2xl font-bold">{experience.analysisCompleted}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Players</p>
                <p className="text-2xl font-bold">{experience.activePlayers}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachStats;
