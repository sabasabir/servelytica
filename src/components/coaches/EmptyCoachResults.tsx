
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface EmptyCoachResultsProps {
  resetFilters: () => void;
}

const EmptyCoachResults = ({ resetFilters }: EmptyCoachResultsProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No coaches found</h3>
      <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
      <Button 
        variant="outline" 
        className="border-tt-blue text-tt-blue"
        onClick={resetFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyCoachResults;
