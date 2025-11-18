
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CoachSpecialty } from "@/types/CoachProfile";

interface CoachSpecialtiesProps {
  specialties: CoachSpecialty[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const CoachSpecialties = ({
  specialties,
  isEditing,
  onAdd,
  onUpdate,
  onRemove
}: CoachSpecialtiesProps) => {
  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coaching Specialties</CardTitle>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {specialties.length === 0 ? (
          <p className="text-center text-muted-foreground">No specialties added yet.</p>
        ) : (
          <div className="space-y-4">
            {specialties.map((specialty, index) => (
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
                      <label className="text-sm font-medium">Specialty Name</label>
                      <Input
                        value={specialty.specialty_type?.name || ''}
                        onChange={(e) => onUpdate(index, 'specialty_type_id', e.target.value)}
                        placeholder="Specialty Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Proficiency Level</label>
                      <Select
                        value={specialty.proficiency}
                        onValueChange={(value) => onUpdate(index, 'proficiency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{specialty.specialty_type?.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getProficiencyColor(specialty.proficiency)}`}>
                      {specialty.proficiency.charAt(0).toUpperCase() + specialty.proficiency.slice(1)}
                    </span>
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

export default CoachSpecialties;
