
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="section-padding bg-tt-blue text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Servelytica?</h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Our professional analysis gives you the competitive edge
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/10 border-0 card-hover">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-tt-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Professional Expertise</h3>
                  <p className="text-blue-100">
                    Our coaches include former champions, Olympic medalists, and certified professional trainers with years of experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-0 card-hover">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-tt-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Personalized Feedback</h3>
                  <p className="text-blue-100">
                    Get tailored advice specific to your playing style, skill level, and the areas you want to improve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-0 card-hover">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-tt-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Visual Analysis</h3>
                  <p className="text-blue-100">
                    Receive annotated video breakdowns that highlight specific techniques and moments in your gameplay.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-0 card-hover">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-tt-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Actionable Drills</h3>
                  <p className="text-blue-100">
                    Each analysis includes specific exercises and drills you can practice to address the identified areas for improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
