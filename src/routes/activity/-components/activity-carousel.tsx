import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ActivityCard from "@/components/activity-card";
import type { Activity } from "@/database/activityDb";
import React from "react";

type ActivityCarouselProps = {
  activities: Activity[];
  prevButtonPosition?: string;
  nextButtonPosition?: string;
};

export function ActivityCarousel({
  activities,
  prevButtonPosition = "left-[30%]",
  nextButtonPosition = "right-[30%]",
}: ActivityCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative px-20">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {activities.map((activity, index) => (
            <CarouselItem
              key={index}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div
                className={`h-full transition-opacity duration-300 ${activities.length <= 3 ? "opacity-100" : index === currentIndex ? "opacity-100" : "opacity-30"}`}
              >
                <ActivityCard activity={activity} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {activities.length > 3 && (
          <>
            <CarouselPrevious className={prevButtonPosition} />
            <CarouselNext className={nextButtonPosition} />
          </>
        )}
      </Carousel>
    </div>
  );
}
