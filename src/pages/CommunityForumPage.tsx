import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  Clock, 
  Users, 
  Pin,
  Search,
  Filter
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { forumService } from '@/services/communityService';
import { ForumCategory, ForumThread } from '@/types/Blog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const CommunityForumPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadThreads();
  }, []);

  useEffect(() => {
    loadThreads();
  }, [selectedCategory, sortBy]);

  const loadCategories = async () => {
    try {
      const data = await forumService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load forum categories');
    }
  };

  const loadThreads = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchQuery || undefined,
        page: 1,
        limit: 20
      };

      const data = await forumService.getThreads(
        selectedCategory === 'all' ? undefined : selectedCategory,
        filters
      );

      // Sort threads based on selected option
      let sorted = [...data];
      switch (sortBy) {
        case 'popular':
          sorted.sort((a, b) => (b.posts_count || 0) - (a.posts_count || 0));
          break;
        case 'views':
          sorted.sort((a, b) => b.views - a.views);
          break;
        case 'recent':
        default:
          sorted.sort((a, b) => 
            new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
          );
      }

      setThreads(sorted);
    } catch (error) {
      console.error('Error loading threads:', error);
      toast.error('Failed to load forum threads');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadThreads();
  };

  const handleCreateThread = () => {
    if (!user) {
      toast.error('Please login to create a thread');
      navigate('/auth');
      return;
    }
    navigate('/forum/new');
  };

  const CategoryCard: React.FC<{ category: ForumCategory }> = ({ category }) => {
    const IconComponent = {
      MessageCircle,
      Target: () => <div className="h-5 w-5">🎯</div>,
      Package: () => <div className="h-5 w-5">📦</div>,
      Trophy: () => <div className="h-5 w-5">🏆</div>,
      Users,
      Video: () => <div className="h-5 w-5">📹</div>
    }[category.icon || 'MessageCircle'] || MessageCircle;

    return (
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setSelectedCategory(category.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconComponent className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{category.name}</h4>
              <p className="text-xs text-gray-500">{category.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ThreadItem: React.FC<{ thread: ForumThread }> = ({ thread }) => {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/forum/thread/${thread.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={thread.author?.avatar_url} />
              <AvatarFallback>
                {thread.author?.display_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {thread.is_pinned && (
                      <Pin className="h-4 w-4 text-orange-500" />
                    )}
                    <h3 className="font-medium hover:text-blue-600 transition-colors">
                      {thread.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{thread.author?.display_name}</span>
                    <Badge variant="secondary">{thread.category?.name}</Badge>
                    <span>
                      {formatDistanceToNow(new Date(thread.last_activity_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.posts_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{thread.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {thread.content}
              </p>

              {thread.last_post && (
                <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                  Last reply by {thread.last_post.author?.display_name} 
                  {' '}
                  {formatDistanceToNow(new Date(thread.last_post.created_at), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                <p className="text-gray-500 mt-1">
                  Join discussions, share insights, and connect with fellow athletes
                </p>
              </div>
              <Button onClick={handleCreateThread}>
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 flex gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Discussions
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Forum Stats */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Forum Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Threads</span>
                    <span className="font-medium">{threads.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Active Users</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Categories</span>
                    <span className="font-medium">{categories.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Thread List */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="trending">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading threads...</p>
                    </div>
                  ) : threads.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No threads found</p>
                        <Button onClick={handleCreateThread} className="mt-4">
                          Start the first discussion
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    threads.map(thread => (
                      <ThreadItem key={thread.id} thread={thread} />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="trending" className="space-y-4">
                  {threads
                    .filter(t => t.views > 100 || (t.posts_count || 0) > 10)
                    .map(thread => (
                      <ThreadItem key={thread.id} thread={thread} />
                    ))}
                </TabsContent>

                <TabsContent value="unanswered" className="space-y-4">
                  {threads
                    .filter(t => (t.posts_count || 0) === 0)
                    .map(thread => (
                      <ThreadItem key={thread.id} thread={thread} />
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityForumPage;