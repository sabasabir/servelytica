import { useEffect, useState } from 'react';

const SectionVerifier = () => {
  const [sectionStatus, setSectionStatus] = useState<Record<string, boolean>>({});
  const [imageStatus, setImageStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkSections = () => {
      const sections = {
        'HeroSection': document.querySelector('.hero-gradient') || document.querySelector('section')?.textContent?.includes('Elevate Your Game'),
        'HowItWorksSection': document.querySelector('section')?.textContent?.includes('How It Works'),
        'FeaturedCoachesSection': document.querySelector('section')?.textContent?.includes('Meet Our Top Coaches'),
        'BenefitsSection': document.querySelector('.bg-tt-blue') || document.querySelector('section')?.textContent?.includes('Why Choose Servelytica'),
        'TestimonialsSection': document.querySelector('section')?.textContent?.includes('What Our Players Say'),
        'CTASection': document.querySelector('section')?.textContent?.includes('Ready to Elevate Your Game'),
        'Footer': document.querySelector('footer')
      };

      const status: Record<string, boolean> = {};
      for (const [name, element] of Object.entries(sections)) {
        status[name] = !!element;
        console.log(`${name}: ${element ? 'FOUND ✓' : 'NOT FOUND ✗'}`);
      }
      setSectionStatus(status);

      // Check images
      const images = document.querySelectorAll('img');
      const imgStatus: Record<string, string> = {};
      images.forEach((img, index) => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || 'no-alt';
        imgStatus[`Image ${index + 1} (${alt})`] = src;
        
        // Check if placeholder.svg is being used
        if (src.includes('placeholder.svg')) {
          console.log(`✓ Image ${index + 1} uses placeholder.svg`);
        }
      });
      setImageStatus(imgStatus);

      // Check page scrollability
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      console.log(`Page height: ${pageHeight}px, Viewport height: ${viewportHeight}px`);
      console.log(`Page is scrollable: ${pageHeight > viewportHeight ? 'YES ✓' : 'NO ✗'}`);
    };

    // Run check after a short delay to ensure everything is loaded
    setTimeout(checkSections, 1000);
  }, []);

  const allSectionsPresent = Object.values(sectionStatus).every(status => status);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: allSectionsPresent ? '#10b981' : '#f59e0b',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
        Section Verification
      </h3>
      <div style={{ fontSize: '12px' }}>
        {Object.entries(sectionStatus).map(([section, present]) => (
          <p key={section} style={{ margin: '2px 0' }}>
            {present ? '✓' : '✗'} {section}
          </p>
        ))}
      </div>
      {Object.keys(imageStatus).length > 0 && (
        <>
          <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Images Found: {Object.keys(imageStatus).length}
          </h4>
          <div style={{ fontSize: '11px' }}>
            {Object.entries(imageStatus).slice(0, 5).map(([name, src]) => (
              <p key={name} style={{ margin: '2px 0', wordBreak: 'break-all' }}>
                {name}: {src.substring(src.lastIndexOf('/') + 1)}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SectionVerifier;