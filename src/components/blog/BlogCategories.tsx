
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string;
  trendingTopics: string[];
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BlogCategories = ({
  categories,
  selectedCategory,
  trendingTopics,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: BlogCategoriesProps) => {
  return (
    <Card className="sticky top-32">
      <CardContent className="p-4">
        <div className="mb-4 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 text-sm"
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-700">Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map(category => (
              <Button
                key={category}
                variant="ghost"
                className={`justify-start h-8 px-2 ${
                  selectedCategory === category 
                    ? "bg-tt-blue/10 text-tt-blue" 
                    : "text-gray-600 hover:text-tt-blue"
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCategories;
