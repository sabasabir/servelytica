
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Video } from "lucide-react";

interface CoachMediaCarouselProps {
  images: string[];
  videos: string[];
}

const CoachMediaCarousel = ({ images, videos }: CoachMediaCarouselProps) => {
  const allMedia = [
    ...videos.map(url => ({ type: 'video', url })),
    ...images.map(url => ({ type: 'image', url }))
  ];

  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {allMedia.map((media, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {media.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={media.url}
                  alt="Coach in action"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default CoachMediaCarousel;
