import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { MatchmakingService, type MatchResult } from "@/services/matchmakingService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Users, CheckCircle, AlertCircle } from "lucide-react";

const MatchmakingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [noMatches, setNoMatches] = useState(false);

  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user && role) {
      fetchMatches();
    }
  }, [user, role]);

  const fetchMatches = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const recommendations = await MatchmakingService.getRecommendations(
        user.id,
        role as 'coach' | 'player',
        10
      );
      if (recommendations.length === 0) {
        setNoMatches(true);
      } else {
        setMatches(recommendations);
        setNoMatches(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (coachId: string, coachName: string) => {
    try {
      if (!user) return;
      await MatchmakingService.createConnection(
        role === 'coach' ? user.id : coachId,
        role === 'coach' ? coachId : user.id
      );
      toast({
        title: "Success",
        description: `Connection request sent to ${coachName}!`,
      });
      // Refresh matches
      fetchMatches();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create connection",
        variant: "destructive",
      });
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return "bg-green-100 text-green-800";
    if (score >= 0.6) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-tt-orange" />
              <h1 className="text-3xl font-bold text-tt-blue">Smart Matchmaking</h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Discover the perfect {role === 'coach' ? 'students' : 'coach'} based on skill level
              and teaching/learning style similarity.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <Users className="h-8 w-8 text-tt-orange" />
              </div>
              <p className="mt-4 text-gray-600">Finding perfect matches...</p>
            </div>
          )}

          {/* No Matches */}
          {noMatches && !loading && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">
                      No matches found yet
                    </p>
                    <p className="text-sm text-amber-700">
                      Complete your profile to improve match suggestions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matches Grid */}
          {!loading && matches.length > 0 && (
            <div className="grid gap-6">
              {matches.map((match) => (
                <Card key={match.coachId} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <Avatar className="h-16 w-16 flex-shrink-0">
                          <AvatarImage src={match.profileImage || ""} />
                          <AvatarFallback>
                            {match.displayName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {match.displayName}
                            </h3>
                            <Badge
                              className={`${getSimilarityColor(
                                match.similarityScore
                              )}`}
                            >
                              {Math.round(match.similarityScore * 100)}% Match
                            </Badge>
                          </div>

                          {match.yearsCoaching !== undefined && (
                            <p className="text-sm text-gray-600 mb-1">
                              {match.yearsCoaching} years of experience
                            </p>
                          )}

                          {match.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {match.bio}
                            </p>
                          )}

                          <div className="mt-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-gray-700">
                              {match.matchReason}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleConnect(match.coachId, match.displayName)}
                        className="ml-4 flex-shrink-0"
                      >
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          {!loading && matches.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={fetchMatches}
                className="border-tt-orange text-tt-orange hover:bg-orange-50"
              >
                Refresh Matches
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatchmakingPage;
