import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  Plus, 
  CheckCircle, 
  Circle,
  TrendingUp,
  Award,
  Clock,
  Eye,
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
import { qaService } from '@/services/communityService';
import { Question } from '@/types/Blog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const QAPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technique', label: 'Technique' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'training', label: 'Training' },
    { value: 'strategy', label: 'Strategy' },
    { value: 'rules', label: 'Rules' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'mental', label: 'Mental Game' }
  ];

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterAndSortQuestions();
  }, [questions, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await qaService.getQuestions({
        page: 1,
        limit: 50
      });
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuestions = () => {
    let filtered = [...questions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(q => q.status === selectedStatus);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0));
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'unanswered':
        filtered.sort((a, b) => {
          if (!a.has_accepted_answer && b.has_accepted_answer) return -1;
          if (a.has_accepted_answer && !b.has_accepted_answer) return 1;
          return (a.answers_count || 0) - (b.answers_count || 0);
        });
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    setFilteredQuestions(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterAndSortQuestions();
  };

  const handleAskQuestion = () => {
    if (!user) {
      toast.error('Please login to ask a question');
      navigate('/auth');
      return;
    }
    navigate('/qa/ask');
  };

  const QuestionCard: React.FC<{ question: Question }> = ({ question }) => {
    const statusColors = {
      open: 'bg-blue-100 text-blue-800',
      answered: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/qa/question/${question.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Stats */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-lg">{question.votes_count || 0}</div>
                <div className="text-xs">votes</div>
              </div>
              <div 
                className={`text-sm ${question.has_accepted_answer ? 'text-green-600' : 'text-gray-500'}`}
              >
                <div className="font-semibold text-lg">{question.answers_count || 0}</div>
                <div className="text-xs">answers</div>
              </div>
              <div className="text-sm text-gray-500">
                <div className="font-semibold text-lg">{question.views}</div>
                <div className="text-xs">views</div>
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {question.has_accepted_answer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <h3 className="font-medium text-lg hover:text-blue-600 transition-colors">
                      {question.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {question.content}
                  </p>
                </div>
                <Badge className={statusColors[question.status]}>
                  {question.status}
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {question.category && (
                  <Badge variant="secondary">{question.category}</Badge>
                )}
                {question.tags?.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={question.author?.avatar_url} />
                    <AvatarFallback>
                      {question.author?.display_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{question.author?.display_name}</span>
                </div>
                <span>
                  asked {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                </span>
              </div>
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
                <h1 className="text-3xl font-bold text-gray-900">Q&A Community</h1>
                <p className="text-gray-500 mt-1">
                  Get expert answers to your tennis technique questions
                </p>
              </div>
              <Button onClick={handleAskQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Questions</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Answered</span>
                    <span className="font-medium text-green-600">
                      {questions.filter(q => q.has_accepted_answer).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Unanswered</span>
                    <span className="font-medium text-orange-600">
                      {questions.filter(q => !q.has_accepted_answer).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">User {i}</p>
                        <p className="text-xs text-gray-500">{100 - i * 10} answers</p>
                      </div>
                      {i <= 3 && (
                        <Award className={`h-4 w-4 ${
                          i === 1 ? 'text-yellow-500' :
                          i === 2 ? 'text-gray-400' :
                          'text-orange-600'
                        }`} />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Questions</TabsTrigger>
                  <TabsTrigger value="unanswered">
                    <Circle className="h-4 w-4 mr-2" />
                    Unanswered
                  </TabsTrigger>
                  <TabsTrigger value="trending">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading questions...</p>
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No questions found</p>
                        <Button onClick={handleAskQuestion} className="mt-4">
                          Be the first to ask
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredQuestions.map(question => (
                      <QuestionCard key={question.id} question={question} />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="unanswered" className="space-y-4">
                  {filteredQuestions
                    .filter(q => !q.has_accepted_answer)
                    .map(question => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                </TabsContent>

                <TabsContent value="trending" className="space-y-4">
                  {filteredQuestions
                    .filter(q => q.views > 50 || (q.votes_count || 0) > 5)
                    .map(question => (
                      <QuestionCard key={question.id} question={question} />
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

export default QAPage;