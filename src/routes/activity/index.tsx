import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ActivityCard from "@/components/activity-card";
import React, { useState } from "react";

export const Route = createFileRoute("/activity/")({
  component: RouteComponent,
});

const spaData = [
  {
    title: "Relaxing Spa Day",
    description: "Enjoy a full day of relaxation at our luxury spa.",
    imageUrl: "/images/spa1.jpg",
  },
  {
    title: "Hot Stone Massage",
    description: "Experience the therapeutic benefits of heated stone therapy.",
    imageUrl: "/images/spa2.jpg",
  },
  {
    title: "Aromatherapy Session",
    description: "Rejuvenate your senses with essential oil treatments.",
    imageUrl: "/images/spa3.jpg",
  },
  {
    title: "Facial Treatment",
    description: "Pamper your skin with our premium facial services.",
    imageUrl: "/images/spa4.jpg",
  },
  {
    title: "Sauna & Steam Room",
    description: "Detoxify and relax in our state-of-the-art facilities.",
    imageUrl: "/images/spa5.jpg",
  },
];

const hikingData = [
  {
    title: "Mountain Hiking",
    description: "Explore breathtaking mountain trails with expert guides.",
    imageUrl: "/images/hiking1.jpg",
  },
  {
    title: "Forest Trail Adventure",
    description: "Discover hidden forest paths and wildlife encounters.",
    imageUrl: "/images/hiking2.jpg",
  },
  {
    title: "Sunset Peak Climb",
    description: "Reach the summit in time for spectacular sunset views.",
    imageUrl: "/images/hiking3.jpg",
  },
  {
    title: "Waterfall Expedition",
    description: "Trek through valleys to magnificent cascading waterfalls.",
    imageUrl: "/images/hiking4.jpg",
  },
  {
    title: "Alpine Ridge Walk",
    description: "Experience stunning panoramic views along alpine ridges.",
    imageUrl: "/images/hiking5.jpg",
  },
];

const pilatesData = [
  {
    title: "Pilates Session",
    description: "Join our invigorating pilates classes for all levels.",
    imageUrl: "/images/pilates1.jpg",
  },
  {
    title: "Reformer Pilates",
    description: "Build strength and flexibility with reformer equipment.",
    imageUrl: "/images/pilates2.jpg",
  },
  {
    title: "Mat Pilates Flow",
    description: "Flow through movements that strengthen your core.",
    imageUrl: "/images/pilates3.jpg",
  },
  {
    title: "Pilates & Stretch",
    description: "Combine pilates with deep stretching techniques.",
    imageUrl: "/images/pilates4.jpg",
  },
  {
    title: "Advanced Pilates",
    description: "Challenge yourself with advanced pilates routines.",
    imageUrl: "/images/pilates5.jpg",
  },
];

function RouteComponent() {
  const [spaApi, setSpaApi] = useState<CarouselApi>();
  const [hikingApi, setHikingApi] = useState<CarouselApi>();
  const [pilatesApi, setPilatesApi] = useState<CarouselApi>();
  const [spaIndex, setSpaIndex] = useState(0);
  const [hikingIndex, setHikingIndex] = useState(0);
  const [pilatesIndex, setPilatesIndex] = useState(0);

  React.useEffect(() => {
    if (!spaApi) return;
    setSpaIndex(spaApi.selectedScrollSnap());
    spaApi.on("select", () => {
      setSpaIndex(spaApi.selectedScrollSnap());
    });
  }, [spaApi]);

  React.useEffect(() => {
    if (!hikingApi) return;
    setHikingIndex(hikingApi.selectedScrollSnap());
    hikingApi.on("select", () => {
      setHikingIndex(hikingApi.selectedScrollSnap());
    });
  }, [hikingApi]);

  React.useEffect(() => {
    if (!pilatesApi) return;
    setPilatesIndex(pilatesApi.selectedScrollSnap());
    pilatesApi.on("select", () => {
      setPilatesIndex(pilatesApi.selectedScrollSnap());
    });
  }, [pilatesApi]);

  return (
    <main>
      <Tabs defaultValue="spa" className="w-full px-4 pt-4">
        <TabsList>
          <TabsTrigger value="spa">Spa</TabsTrigger>
          <TabsTrigger value="hiking">Hiking</TabsTrigger>
          <TabsTrigger value="pilates">Pilates</TabsTrigger>
        </TabsList>
        <TabsContent value="spa">
          <div className="relative px-20">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setSpaApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {spaData.map((activity, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className={`transition-opacity duration-300 ${index === spaIndex ? "opacity-100" : "opacity-30"}`}
                    >
                      <ActivityCard activity={activity} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[30%]" />
              <CarouselNext className="right-[30%]" />
            </Carousel>
          </div>
        </TabsContent>
        <TabsContent value="hiking">
          <div className="relative px-20">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setHikingApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {hikingData.map((activity, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className={`transition-opacity duration-300 ${index === hikingIndex ? "opacity-100" : "opacity-30"}`}
                    >
                      <ActivityCard activity={activity} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[30%]" />
              <CarouselNext className="right-[30%]" />
            </Carousel>
          </div>
        </TabsContent>
        <TabsContent value="pilates">
          <div className="relative px-20">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setPilatesApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {pilatesData.map((activity, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className={`transition-opacity duration-300 ${index === pilatesIndex ? "opacity-100" : "opacity-30"}`}
                    >
                      <ActivityCard activity={activity} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[25%]" />
              <CarouselNext className="right-[25%]" />
            </Carousel>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
