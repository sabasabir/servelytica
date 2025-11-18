
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CoachSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CoachSearch = ({ searchQuery, setSearchQuery }: CoachSearchProps) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search by coach name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CoachSearch;
