
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { CoachEducation as CoachEducationType } from "@/types/CoachProfile";

interface CoachEducationProps {
  education: CoachEducationType[];
  isEditing: boolean;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const CoachEducation = ({
  education,
  isEditing,
  onAdd,
  onUpdate,
  onRemove
}: CoachEducationProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education & Certifications</CardTitle>
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
        {education.length === 0 ? (
          <p className="text-center text-muted-foreground">No education records added yet.</p>
        ) : (
          <div className="space-y-4">
            {education.map((edu, index) => (
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
                        value={edu.year_completed?.toString() || ''}
                        onChange={(e) => onUpdate(index, 'year_completed', e.target.value)}
                        placeholder="Year"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Degree/Certification</label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => onUpdate(index, 'degree', e.target.value)}
                        placeholder="Degree or Certification Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Institution</label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => onUpdate(index, 'institution', e.target.value)}
                        placeholder="Institution Name"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{edu.degree}</span>
                      <span className="text-sm text-gray-500">{edu.year_completed}</span>
                    </div>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
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

export default CoachEducation;
