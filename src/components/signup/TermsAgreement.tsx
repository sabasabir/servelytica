
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface TermsAgreementProps {
  agreeTerms: boolean;
  setAgreeTerms: (agreeTerms: boolean) => void;
}

const TermsAgreement = ({
  agreeTerms,
  setAgreeTerms
}: TermsAgreementProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="terms" 
        checked={agreeTerms}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            setAgreeTerms(checked);
          }
        }}
        required
      />
      <Label htmlFor="terms" className="text-sm font-normal">
        I agree to the{" "}
        <Link to="#" className="text-tt-orange hover:underline">
          Terms of Service
        </Link>
        {" "}and{" "}
        <Link to="#" className="text-tt-orange hover:underline">
          Privacy Policy
        </Link>
      </Label>
    </div>
  );
};

export default TermsAgreement;
