
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "The analysis I received was incredibly detailed. My coach spotted flaws in my technique that I never noticed myself. After implementing their suggestions, my game improved dramatically!",
      author: "Jennifer L.",
      role: "Amateur Player"
    },
    {
      id: 2,
      text: "As a competitive player, I was looking for that edge to take my game to the next level. The professional analysis helped me refine my strategy against specific opponents. Worth every penny!",
      author: "Marcus T.",
      role: "Regional Competitor"
    },
    {
      id: 3,
      text: "I was skeptical at first, but the insights from my analysis were eye-opening. My coach provided drills specifically tailored to fix my weaknesses. My club teammates have definitely noticed the improvement!",
      author: "Aisha K.",
      role: "Club Player"
    }
  ];

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-tt-blue mb-4">What Our Players Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from players who have improved their game through our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
