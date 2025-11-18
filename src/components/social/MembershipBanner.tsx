
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const MembershipBanner = () => {
  return (
    <Card className="mb-6 bg-amber-50 border-amber-200">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Lock className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-medium text-amber-800">Connect Feature Limited</h3>
            <p className="text-amber-700">Your free membership allows you to browse players, but connecting requires an Advanced or Pro plan.</p>
          </div>
          <Link to="/pricing" className="ml-auto">
            <Button className="bg-tt-orange text-white hover:bg-orange-600">
              Upgrade Membership
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipBanner;
