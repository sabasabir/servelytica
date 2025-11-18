
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const SportSelection = () => {
  const sports = [
    {
      name: "Table Tennis",
      path: "/table-tennis",
      description: "Analyze and improve your table tennis game"
    },
    {
      name: "Pickleball",
      path: "/pickleball",
      description: "Master the fastest growing racquet sport"
    },
    {
      name: "Badminton",
      path: "/badminton",
      description: "Enhance your badminton techniques"
    },
    {
      name: "Tennis",
      path: "/tennis",
      description: "Perfect your tennis skills"
    },
    {
      name: "Squash",
      path: "/squash",
      description: "Improve your squash performance"
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/lovable-uploads/95b27aed-35ef-4105-8648-b82dca2c662f.png"
          alt="Sports Equipment Background"
          className="w-full h-full object-cover object-center scale-110"
        />
        <div className="absolute inset-0 hero-gradient opacity-85"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Sport
          </h1>
          <p className="text-lg text-white/80">
            Select your racquet sport to get started with personalized analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <Link to={sport.path} key={sport.name}>
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-semibold text-tt-blue mb-2">{sport.name}</h3>
                    <p className="text-gray-600">{sport.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportSelection;
