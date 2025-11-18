import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Award, 
  TrendingUp, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit,
  Settings,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Heart,
  Users,
  Trophy,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  userProfileService, 
  followService, 
  reputationService 
} from '@/services/communityService';
import { UserProfile as UserProfileType } from '@/types/Blog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const EnhancedUserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, userProfile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [content, setContent] = useState<any>({
    articles: [],
    questions: [],
    answers: [],
    comments: []
  });
  const [reputationHistory, setReputationHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  useEffect(() => {
    if (profileUserId) {
      loadProfile();
      loadContent();
      loadReputationHistory();
      checkFollowStatus();
    }
  }, [profileUserId]);

  const loadProfile = async () => {
    if (!profileUserId) return;

    setLoading(true);
    try {
      const stats = await userProfileService.getUserStats(profileUserId);
      setProfile(stats);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    if (!profileUserId) return;

    try {
      const [articles, questions, answers, comments] = await Promise.all([
        userProfileService.getUserContent(profileUserId, 'articles'),
        userProfileService.getUserContent(profileUserId, 'questions'),
        userProfileService.getUserContent(profileUserId, 'answers'),
        userProfileService.getUserContent(profileUserId, 'comments')
      ]);

      setContent({ articles, questions, answers, comments });
    } catch (error) {
      console.error('Error loading user content:', error);
    }
  };

  const loadReputationHistory = async () => {
    if (!profileUserId) return;

    try {
      const history = await reputationService.getReputationHistory(profileUserId, 10);
      setReputationHistory(history);
    } catch (error) {
      console.error('Error loading reputation history:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUser || !profileUserId || isOwnProfile) return;

    try {
      const status = await followService.isFollowing(currentUser.id, profileUserId);
      setIsFollowing(status);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    if (!profileUserId) return;

    try {
      if (isFollowing) {
        await followService.unfollowUser(currentUser.id, profileUserId);
        setIsFollowing(false);
        toast.success('Unfollowed successfully');
      } else {
        await followService.followUser(currentUser.id, profileUserId);
        setIsFollowing(true);
        toast.success('Following successfully');
      }
      
      // Reload profile to update follower count
      loadProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const getLevelBadge = (level: number) => {
    const levels = [
      { level: 1, name: 'Beginner', color: 'bg-gray-500' },
      { level: 2, name: 'Member', color: 'bg-blue-500' },
      { level: 3, name: 'Contributor', color: 'bg-green-500' },
      { level: 4, name: 'Expert', color: 'bg-purple-500' },
      { level: 5, name: 'Master', color: 'bg-yellow-500' }
    ];
    return levels[Math.min(level - 1, 4)];
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const levelInfo = getLevelBadge(profile.reputation_level || 1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        {/* Profile Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile.display_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-3xl font-bold">{profile.display_name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={`${levelInfo.color} text-white`}>
                      {levelInfo.name}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {profile.reputation_points} points
                    </span>
                  </div>

                  {/* User Stats */}
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div>
                      <span className="font-semibold">{profile.followers_count || 0}</span>
                      <span className="text-gray-500 ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-semibold">{profile.following_count || 0}</span>
                      <span className="text-gray-500 ml-1">following</span>
                    </div>
                    <div>
                      <span className="font-semibold">{profile.articles_count || 0}</span>
                      <span className="text-gray-500 ml-1">articles</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleFollowToggle}
                    variant={isFollowing ? 'outline' : 'default'}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {profile.articles_count > 0 && (
                      <div className="text-center p-2">
                        <BookOpen className="h-8 w-8 mx-auto text-blue-500" />
                        <p className="text-xs mt-1">Writer</p>
                      </div>
                    )}
                    {profile.answers_count > 5 && (
                      <div className="text-center p-2">
                        <HelpCircle className="h-8 w-8 mx-auto text-green-500" />
                        <p className="text-xs mt-1">Helper</p>
                      </div>
                    )}
                    {profile.reputation_points > 100 && (
                      <div className="text-center p-2">
                        <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                        <p className="text-xs mt-1">Veteran</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reputation Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reputation Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Level {profile.reputation_level || 1}</span>
                      <span>{profile.reputation_points} points</span>
                    </div>
                    <Progress 
                      value={((profile.reputation_points || 0) % 100)} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500">
                      {100 - ((profile.reputation_points || 0) % 100)} points to next level
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Articles
                    </span>
                    <span className="font-medium">{profile.articles_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comments
                    </span>
                    <span className="font-medium">{profile.comments_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Questions
                    </span>
                    <span className="font-medium">{profile.questions_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Answers
                    </span>
                    <span className="font-medium">{profile.answers_count || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="articles">Articles</TabsTrigger>
                  <TabsTrigger value="questions">Q&A</TabsTrigger>
                  <TabsTrigger value="reputation">Reputation</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Recent Articles */}
                  {content.articles.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Articles</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {content.articles.slice(0, 3).map((article: any) => (
                          <div key={article.id} className="space-y-1">
                            <h4 className="font-medium hover:text-blue-600 cursor-pointer">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                              <span>{article.views} views</span>
                              <span>{article.reactions?.[0]?.count || 0} likes</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reputationHistory.slice(0, 5).map((event, index) => (
                          <div key={event.id} className="flex items-start gap-3">
                            <div className="mt-1">
                              {event.points_change > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{event.description}</p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                                {event.points_change !== 0 && (
                                  <span className={`ml-2 font-medium ${
                                    event.points_change > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {event.points_change > 0 ? '+' : ''}{event.points_change} points
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="articles" className="space-y-4">
                  {content.articles.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No articles yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    content.articles.map((article: any) => (
                      <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-2">{article.title}</h3>
                          {article.excerpt && (
                            <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <Badge variant="secondary">{article.category?.name}</Badge>
                            <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                            <span>{article.views} views</span>
                            <span>{article.reactions?.[0]?.count || 0} reactions</span>
                            <span>{article.comments?.[0]?.count || 0} comments</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-3">Questions ({content.questions.length})</h3>
                      {content.questions.length === 0 ? (
                        <p className="text-gray-500 text-sm">No questions asked yet</p>
                      ) : (
                        <div className="space-y-2">
                          {content.questions.map((question: any) => (
                            <Card key={question.id}>
                              <CardContent className="p-3">
                                <h4 className="font-medium text-sm">{question.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span>{question.answers?.[0]?.count || 0} answers</span>
                                  <span>{question.views} views</span>
                                  <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Answers ({content.answers.length})</h3>
                      {content.answers.length === 0 ? (
                        <p className="text-gray-500 text-sm">No answers provided yet</p>
                      ) : (
                        <div className="space-y-2">
                          {content.answers.map((answer: any) => (
                            <Card key={answer.id}>
                              <CardContent className="p-3">
                                <p className="text-sm line-clamp-2">{answer.content}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                  {answer.is_accepted && (
                                    <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                                  )}
                                  <span>on: {answer.question?.title}</span>
                                  <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reputation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reputation History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reputationHistory.map((event) => (
                          <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="text-sm font-medium">{event.event_type}</p>
                              <p className="text-xs text-gray-500">{event.description}</p>
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            <span className={`font-semibold ${
                              event.points_change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {event.points_change > 0 ? '+' : ''}{event.points_change}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

export default EnhancedUserProfilePage;