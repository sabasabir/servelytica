
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Player } from "./PlayerCard";

interface UpgradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlayer: Player | null;
}

const UpgradeDialog = ({ isOpen, onOpenChange, selectedPlayer }: UpgradeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Membership Upgrade Required</DialogTitle>
          <DialogDescription>
            Connecting with players is available for Advanced and Pro members only.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Upgrade your membership to start connecting with players like {selectedPlayer?.name} and arrange practice sessions.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Advanced & Pro Membership Benefits:</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-tt-orange flex-shrink-0 mr-2" />
                <span>Connect with unlimited players</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-tt-orange flex-shrink-0 mr-2" />
                <span>Arrange practice sessions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-tt-orange flex-shrink-0 mr-2" />
                <span>Access to coaching sessions</span>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <Link to="/pricing">
            <Button className="bg-tt-orange text-white hover:bg-orange-600">
              View Plans
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
