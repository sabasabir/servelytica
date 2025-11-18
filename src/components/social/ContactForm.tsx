
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { FormEvent } from "react";
import { Player } from "./PlayerCard";

interface ContactFormProps {
  player: Player;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

const ContactForm = ({ player, onClose, onSubmit }: ContactFormProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect with {player.name}</CardTitle>
          <CardDescription>Send a message to introduce yourself</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <textarea 
                id="message"
                className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tt-blue"
                placeholder="Hi! I'm looking for someone to practice with. Would you be interested in playing at the local club sometime?"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-tt-orange text-white hover:bg-orange-600">
              <Mail className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ContactForm;
