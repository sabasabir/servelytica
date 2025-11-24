import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Player } from "./PlayerCard";

interface ContactFormProps {
  player: Player;
  onClose: () => void;
}

const ConnectRequestModal = ({ player, onClose }: ContactFormProps) => {
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userProfile || !user?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/connection-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: player?.id,
          message: `${
            userProfile?.display_name || userProfile?.username || "A player"
          } wants to connect with you!`,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409 || responseData.error?.includes('unique')) {
          toast({
            title: "Already sent",
            description:
              "You have already sent a connection request to this player",
            variant: "destructive",
          });
        } else {
          throw new Error(responseData.error || 'Failed to send connection request');
        }
      } else {
        toast({
          title: "Success",
          description: "Connection request sent successfully!",
          variant: "default",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect with {player.name}</CardTitle>
          <CardDescription>
            Send a connection request to start practicing together!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Would you like to send a connection request to {player.name}? Once
            they accept, you'll be able to message each other and arrange
            practice sessions.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-tt-orange text-white hover:bg-orange-600"
            disabled={isSubmitting}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConnectRequestModal;
