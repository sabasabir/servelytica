
const FeaturedCoachesSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Meet Our Top Coaches</h2>
          <p className="text-lg text-gray-600">
            Learn from the best minds in table tennis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Coach 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Michael Chen" 
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">Michael Chen</h3>
              <p className="text-gray-600 mb-3">Former National Champion</p>
              <div className="flex items-center mb-3">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm font-semibold">4.9</span>
                <span className="text-sm text-gray-500 ml-2">(124 reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Coach 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Sarah Wong" 
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">Sarah Wong</h3>
              <p className="text-gray-600 mb-3">Olympic Medalist</p>
              <div className="flex items-center mb-3">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm font-semibold">5.0</span>
                <span className="text-sm text-gray-500 ml-2">(98 reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Coach 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="David Müller" 
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">David Müller</h3>
              <p className="text-gray-600 mb-3">Professional Coach</p>
              <div className="flex items-center mb-3">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm font-semibold">4.8</span>
                <span className="text-sm text-gray-500 ml-2">(156 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoachesSection;
