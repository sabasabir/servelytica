
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface Person {
  name: string;
  handle: string;
  avatar: string;
}

interface BlogSuggestionsProps {
  peopleToFollow: Person[];
}

const BlogSuggestions = ({ peopleToFollow }: BlogSuggestionsProps) => {
  return (
    // <Card className="mb-6 sticky top-32">
    <Card className="mb-6">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-gray-700">Who to Follow</h3>
        <div className="space-y-3">
          {peopleToFollow.map((person, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.handle}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs border-tt-blue text-tt-blue hover:bg-tt-blue hover:text-white">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogSuggestions;
