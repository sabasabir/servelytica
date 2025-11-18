
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { BookOpen, TrendingUp, Users, Calendar, Bell, Bookmark, PlusCircle } from "lucide-react";
import ArticleCreationModal from "./ArticleCreationModal";
import { useState } from "react";

const BlogNavigation = ({handleRefetch}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleArticleCreated = (results) => {
        handleRefetch();
        console.log({results})
    }
    
  return (
    <div className="bg-white border-b sticky top-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14">
          <div className="flex items-center gap-2 text-tt-blue font-semibold text-lg">
            <BookOpen className="h-5 w-5" />
            <span>PingPros Feed</span>
          </div>
          
          <NavigationMenu className="ml-8">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " gap-2"} href="/blog">
                  <TrendingUp className="h-4 w-4" />
                  <span>For You</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " gap-2"} href="/blog/following">
                  <Users className="h-4 w-4" />
                  <span>Following</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " gap-2"} href="/blog/latest">
                  <Calendar className="h-4 w-4" />
                  <span>Latest</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " gap-2"} href="/blog/saved">
                  <Bookmark className="h-4 w-4" />
                  <span>Saved</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="ml-auto flex items-center gap-4">
            {/* <Link to="/blog/create"> */}
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="gap-1 border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white">
                <PlusCircle className="h-4 w-4" />
                Create Post
              </Button>
            {/* </Link> */}
            <button className="text-gray-500 hover:text-tt-blue transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <ArticleCreationModal onArticleCreated={handleArticleCreated} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BlogNavigation;
