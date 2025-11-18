import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalysisQuotaService } from "@/services/analysisQuotaService";

interface QuotaExceededDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quota: {
    analysesUsed: number;
    analysesLimit: number;
    nextResetDate: Date | null;
  };
}

export const QuotaExceededDialog = ({ isOpen, onOpenChange, quota }: QuotaExceededDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Analysis Limit Reached
          </DialogTitle>
          <DialogDescription>
            You've used all {quota.analysesLimit} video analyses for this month.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="space-y-2">
              <p className="text-sm text-orange-800">
                <strong>Current Usage:</strong> {quota.analysesUsed}/{quota.analysesLimit} analyses used
              </p>
              {quota.nextResetDate && (
                <p className="text-sm text-orange-800">
                  <strong>Next Reset:</strong> {AnalysisQuotaService.formatResetDate(quota.nextResetDate)}
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Upgrade for More Analyses:</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mr-2 mt-0.5" />
                <span>Unlimited video analyses</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mr-2 mt-0.5" />
                <span>Priority coach feedback</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mr-2 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Link to="/pricing">
            <Button className="bg-tt-orange text-white hover:bg-orange-600">
              Upgrade Plan
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};