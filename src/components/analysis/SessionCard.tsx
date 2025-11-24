import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface SessionCardProps {
  session: any;
  onEdit: (session: any) => void;
  onDelete: (session: any) => void;
  onOpen: (sessionId: string) => void;
}

const SessionCard = ({ session, onEdit, onDelete, onOpen }: SessionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{session.title}</CardTitle>
            <CardDescription>{session.description}</CardDescription>
          </div>
          <Badge variant={getStatusColor(session.status)}>
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{getTypeLabel(session.session_type)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">
              {format(new Date(session.created_at), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpen(session.id)}
              className="flex-1"
            >
              Open
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(session)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(session)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
