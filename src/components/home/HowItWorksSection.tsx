import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Award, ArrowUpRight, Video, Activity, Footprints, ChevronRight, BarChart, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAnalysisFeatures } from "@/utils/membershipUtils";

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-tt-blue mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get professional feedback on your table tennis game in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-tt-orange card-hover">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-tt-orange/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-tt-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Upload Your Video</h3>
              <p className="text-gray-600">
                Record your practice session or match and upload it to our platform. You can specify what aspects you want feedback on.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-tt-orange p-0 mt-2 h-auto flex items-center gap-1">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Free Video Analysis Features</DialogTitle>
                    <DialogDescription>
                      Our AI-powered system provides detailed insights on your table tennis technique
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="stroke" className="mt-4">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="stroke">Stroke Practice Analysis</TabsTrigger>
                      <TabsTrigger value="match">Match Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="stroke" className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-tt-orange" />
                          <h3 className="font-semibold text-lg">Stroke Practice Analysis</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Upload videos of your practice sessions focused on specific strokes to receive detailed feedback:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex gap-3 items-start mb-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                  <Eye className="h-4 w-4 text-amber-600" />
                                </div>
                                <h5 className="font-medium">Stroke Detection</h5>
                              </div>
                              <ul className="ml-8 list-disc text-sm space-y-2 text-gray-600">
                                <li>Identifies stroke type (forehand topspin, backhand drive, etc.)</li>
                                <li>Recognizes technique variations</li>
                                <li>Detects stroke patterns and consistency</li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex gap-3 items-start mb-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                  <BarChart className="h-4 w-4 text-blue-600" />
                                </div>
                                <h5 className="font-medium">Form Analysis</h5>
                              </div>
                              <ul className="ml-8 list-disc text-sm space-y-2 text-gray-600">
                                <li>Proper swing arc evaluation</li>
                                <li>Body position and bend assessment</li>
                                <li>Strike velocity measurement</li>
                                <li>Footwork positioning analysis</li>
                                <li>Technique correction suggestions</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-tt-blue mb-2">How it works:</h4>
                          <p className="text-sm text-gray-600">
                            Our system uses computer vision to analyze your strokes frame by frame, comparing 
                            your form to optimal techniques. You'll receive specific feedback on your body positioning,
                            swing path, contact point, and follow-through.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="match" className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-tt-orange" />
                          <h3 className="font-semibold text-lg">Match Analysis</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Upload your tournament or practice match videos to receive comprehensive game analysis:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex gap-3 items-start mb-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                  <Video className="h-4 w-4 text-red-600" />
                                </div>
                                <h5 className="font-medium">Technique Evaluation</h5>
                              </div>
                              <ul className="ml-8 list-disc text-sm space-y-2 text-gray-600">
                                <li>Identifies incorrect strokes played</li>
                                <li>Highlights technical errors in real match situations</li>
                                <li>Provides stroke effectiveness evaluation</li>
                                <li>Suggests adjustments for improved performance</li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex gap-3 items-start mb-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                  <Footprints className="h-4 w-4 text-green-600" />
                                </div>
                                <h5 className="font-medium">Movement & Performance</h5>
                              </div>
                              <ul className="ml-8 list-disc text-sm space-y-2 text-gray-600">
                                <li>Evaluates footwork coordination with strokes</li>
                                <li>Measures stroke speed throughout the match</li>
                                <li>Tracks player positioning and court coverage</li>
                                <li>Identifies movement pattern weaknesses</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-tt-blue mb-2">How it works:</h4>
                          <p className="text-sm text-gray-600">
                            Our advanced AI analyzes your entire match, breaking down key moments and providing 
                            statistics on your performance. You'll get insights on stroke selection, technical execution,
                            footwork efficiency, and tactical patterns to improve your competitive play.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-tt-blue card-hover">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-tt-blue/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-tt-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Choose a Coach</h3>
              <p className="text-gray-600">
                Browse our roster of professional coaches with different specialties and select the one that best matches your needs.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-tt-orange card-hover">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-tt-orange/10 rounded-full flex items-center justify-center mb-4">
                <ArrowUpRight className="h-6 w-6 text-tt-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Receive Analysis</h3>
              <p className="text-gray-600">
                Get detailed video analysis with personalized tips, feedback, and drills to improve your game within 48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-tt-blue mb-6">Technology Behind Our Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            <TooltipProvider>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Coaches and Mentors Team</h4>
                <p className="text-sm text-gray-600 text-center">Detects stroke types and body positioning in real-time</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" size="sm" className="mt-2">Learn more</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80 text-sm">Our expert coaches and mentors track your movements, analyzing over 30 body points to ensure accurate technique assessment.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Motion Analysis</h4>
                <p className="text-sm text-gray-600 text-center">Measures speed, arc, and timing of your strokes</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" size="sm" className="mt-2">Learn more</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80 text-sm">Our system calculates precise measurements of stroke velocity, racket angle, and swing path to provide data-driven feedback.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Footprints className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-800 mb-1">Footwork Assessment</h4>
                <p className="text-sm text-gray-600 text-center">Tracks movement patterns and positioning efficiency</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" size="sm" className="mt-2">Learn more</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80 text-sm">Our footwork analysis identifies weight transfer, balance issues, and movement efficiency to help improve your court coverage.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          
          <Link to="/upload">
            <Button className="bg-tt-orange hover:bg-orange-600 text-white">
              Start Your Free Analysis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
