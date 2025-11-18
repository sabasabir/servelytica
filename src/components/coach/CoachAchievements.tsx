
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { CoachAchievement } from "@/types/CoachProfile";

interface CoachAchievementsProps {
  achievements: CoachAchievement[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const CoachAchievements = ({
  achievements,
  isEditing,
  onAdd,
  onUpdate,
  onRemove
}: CoachAchievementsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Achievements & Certifications</CardTitle>
        {isEditing && (
          <Button
            onClick={onAdd}
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No achievements added yet
          </div>
        ) : (
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`${
                  isEditing ? "border p-4 rounded-md relative" : ""
                }`}
              >
                {isEditing ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      <Input
                        id={`year-${index}`}
                        value={achievement.year}
                        onChange={(e) =>
                          onUpdate(index, "year", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={achievement.title}
                        onChange={(e) =>
                          onUpdate(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Input
                        id={`description-${index}`}
                        value={achievement.description}
                        onChange={(e) =>
                          onUpdate(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove achievement</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="w-16 text-center">
                      <span className="font-bold text-tt-blue">{achievement.year}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachAchievements;
