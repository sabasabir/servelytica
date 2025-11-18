
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-tt-blue to-tt-lightBlue text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Game?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of players who are taking their table tennis skills to the next level with professional analysis.
          </p>
          <Link to="/upload">
            <Button className="btn-primary text-lg">
              Upload Your Game Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
