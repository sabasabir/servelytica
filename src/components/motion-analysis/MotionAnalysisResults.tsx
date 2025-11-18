import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, Target, Award, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

interface MotionAnalysisResultsProps {
  sessionId: string;
}

interface AnalysisResult {
  id: string;
  session_id: string;
  analysis_type: string;
  score: number;
  feedback: string;
  areas_of_improvement: string[];
  strengths: string[];
}

const MotionAnalysisResults = ({ sessionId }: MotionAnalysisResultsProps) => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('motion_analysis_results')
        .select('*')
        .eq('session_id', sessionId)
        .order('analysis_type');

      if (error) throw error;
      
      setResults(data || []);
      
      // Calculate overall score
      if (data && data.length > 0) {
        const avgScore = data.reduce((acc, r) => acc + (r.score || 0), 0) / data.length;
        setOverallScore(Math.round(avgScore));
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: "Error",
        description: "Failed to load analysis results.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const prepareRadarData = () => {
    return results.map((result) => ({
      category: result.analysis_type.charAt(0).toUpperCase() + result.analysis_type.slice(1).replace('_', ' '),
      score: result.score || 0,
      fullMark: 100
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading analysis results...</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No analysis results available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(overallScore)}>{overallScore}</span>
              <span className="text-gray-400 text-2xl">/100</span>
            </div>
            <Badge variant={getScoreBadgeVariant(overallScore)} className="text-lg px-4 py-2">
              {overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <Progress value={overallScore} className="h-3 mb-4" />
          <p className="text-gray-600">
            Your technique analysis shows {overallScore >= 70 ? 'strong fundamentals' : 'areas for improvement'} across
            all evaluated categories. Focus on the detailed feedback below to enhance your performance.
          </p>
        </CardContent>
      </Card>

      {/* Performance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Visual representation of your technique across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={prepareRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#FF7043"
                  fill="#FF7043"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>In-depth feedback for each aspect of your technique</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={results[0]?.analysis_type} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              {results.map((result) => (
                <TabsTrigger
                  key={result.analysis_type}
                  value={result.analysis_type}
                  className="capitalize"
                >
                  {result.analysis_type.replace('_', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            {results.map((result) => (
              <TabsContent key={result.analysis_type} value={result.analysis_type} className="space-y-4">
                {/* Score Display */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {result.analysis_type.replace('_', ' ')} Analysis
                    </h3>
                    <p className="text-gray-600">Performance Score</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      <span className={getScoreColor(result.score)}>{result.score}</span>
                      <span className="text-gray-400 text-xl">/100</span>
                    </div>
                    <Badge variant={getScoreBadgeVariant(result.score)}>
                      {result.score >= 85 ? 'Excellent' : result.score >= 70 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>

                {/* Feedback */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{result.feedback}</AlertDescription>
                </Alert>

                {/* Strengths and Improvements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <Card className="border-green-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">Strengths</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths?.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-base">Areas for Improvement</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.areas_of_improvement?.map((area, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <TrendingDown className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Training Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Training Recommendations</CardTitle>
          <CardDescription>Personalized exercises to improve your technique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tt-orange/10 flex items-center justify-center flex-shrink-0">
                <span className="text-tt-orange font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Shadow Practice</h4>
                <p className="text-sm text-gray-600">
                  Practice your strokes without the ball to focus on form and technique. 15 minutes daily.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tt-orange/10 flex items-center justify-center flex-shrink-0">
                <span className="text-tt-orange font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Footwork Drills</h4>
                <p className="text-sm text-gray-600">
                  Improve your movement patterns with ladder drills and cone exercises. 3 times per week.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tt-orange/10 flex items-center justify-center flex-shrink-0">
                <span className="text-tt-orange font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Video Review</h4>
                <p className="text-sm text-gray-600">
                  Record and review your practice sessions weekly to track improvement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotionAnalysisResults;