import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, Search, MessageSquare, TrendingUp, Play, Users, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorksSection = () => {
  const steps = [
    {
      id: "upload",
      icon: Upload,
      title: "Upload Your Game",
      description: "Record your match and upload the video",
      details: "Simply record your table tennis match using any camera or smartphone. Upload the video in MP4, MOV, or AVI format (up to 500MB). We accept matches from any level - whether you're a beginner or advanced player."
    },
    {
      id: "choose",
      icon: Search,
      title: "Choose a Coach",
      description: "Select from our expert coaches",
      details: "Browse through our roster of certified coaches, each with their specialization areas. Filter by expertise, rating, or price. Read reviews from other players to find the perfect match for your playing style and goals."
    },
    {
      id: "analysis",
      icon: MessageSquare,
      title: "Get Analysis",
      description: "Receive detailed feedback on your game",
      details: "Within 24-48 hours, receive a comprehensive video analysis. Your coach will provide timestamp-specific feedback, slow-motion breakdowns, technique corrections, and personalized drills to improve your weak points."
    },
    {
      id: "improve",
      icon: TrendingUp,
      title: "Improve Your Skills",
      description: "Practice with personalized drills",
      details: "Follow the customized training plan created by your coach. Track your progress over time, upload follow-up videos for continuous improvement, and watch your game evolve with professional guidance."
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get professional coaching in four simple steps
          </p>
        </div>

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Process</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <TooltipProvider>
                {steps.map((step, index) => (
                  <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                      <Card className="relative hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <step.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-200">{index + 1}</span>
                          </div>
                          <CardTitle className="text-lg mb-2">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{step.details}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-8">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.details}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{step.title}</DialogTitle>
                          <DialogDescription className="pt-4">
                            <div className="space-y-4">
                              <p>{step.details}</p>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Pro Tips:</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                  {step.id === "upload" && (
                                    <>
                                      <li>Ensure good lighting and stable camera position</li>
                                      <li>Film from the side for best angle</li>
                                      <li>Include both players in frame</li>
                                    </>
                                  )}
                                  {step.id === "choose" && (
                                    <>
                                      <li>Check coach specializations</li>
                                      <li>Read recent reviews</li>
                                      <li>Consider your specific needs</li>
                                    </>
                                  )}
                                  {step.id === "analysis" && (
                                    <>
                                      <li>Watch the full analysis video</li>
                                      <li>Take notes on key points</li>
                                      <li>Ask follow-up questions</li>
                                    </>
                                  )}
                                  {step.id === "improve" && (
                                    <>
                                      <li>Practice drills consistently</li>
                                      <li>Film progress videos</li>
                                      <li>Track your improvements</li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Coaches</h3>
              <p className="text-gray-600">Professional players and certified coaches</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personalized Feedback</h3>
              <p className="text-gray-600">Tailored advice for your playing style</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">Join hundreds of improving players</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/upload">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;