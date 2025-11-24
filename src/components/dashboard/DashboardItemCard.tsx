import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, CheckCircle2, Clock } from "lucide-react";

interface DashboardItemCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (itemId: string) => void;
  onComplete: (itemId: string) => void;
}

export const DashboardItemCard = ({
  item,
  onEdit,
  onDelete,
  onComplete,
}: DashboardItemCardProps) => {
  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    archived: "bg-gray-200 text-gray-700",
  };

  const priorityColors = {
    low: "bg-green-50 border-green-200",
    medium: "bg-yellow-50 border-yellow-200",
    high: "bg-red-50 border-red-200",
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${priorityColors[item.priority as keyof typeof priorityColors]}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
          <Badge variant="outline">{item.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center gap-2">
          <Badge className={statusColors[item.status as keyof typeof statusColors]}>
            {item.status.replace('_', ' ')}
          </Badge>
          {item.dueDate && (
            <span className="text-xs text-gray-500">
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {item.status !== "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onComplete(item.id)}
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(item)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardItemCard;
