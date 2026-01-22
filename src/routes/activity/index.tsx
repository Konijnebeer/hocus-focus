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
import React, { useState, useEffect } from "react";
import { getAllActivities, seedActivities, type Activity } from "@/database/activityDb";

export const Route = createFileRoute("/activity/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [yogaApi, setYogaApi] = useState<CarouselApi>();
  const [hikingApi, setHikingApi] = useState<CarouselApi>();
  const [pilatesApi, setPilatesApi] = useState<CarouselApi>();
  const [yogaIndex, setYogaIndex] = useState(0);
  const [hikingIndex, setHikingIndex] = useState(0);
  const [pilatesIndex, setPilatesIndex] = useState(0);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load activities from database on component mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        // Seed initial data if database is empty
        await seedActivities();
        // Get all activities from database
        const allActivities = await getAllActivities();
        setActivities(allActivities);
        setError(null);
      } catch (err) {
        console.error('Error loading activities:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Helper function to get activities by category
  const getActivitiesByCategory = (category: string): Activity[] => {
    return activities.filter(activity => activity.category === category && activity.status === 'active');
  };


  const [yogaData, setYogaData] = useState<Activity[]>([]);
  const [hikingData, setHikingData] = useState<Activity[]>([]);
  const [pilatesData, setPilatesData] = useState<Activity[]>([]);

  React.useEffect(() => {
    setYogaData(getActivitiesByCategory('yoga'));
    setHikingData(getActivitiesByCategory('hiking'));
    setPilatesData(getActivitiesByCategory('pilates'));
    console.log('Activities loaded:', activities);
  }, [activities]);

  React.useEffect(() => {
    if (!yogaApi) return;
    setYogaIndex(yogaApi.selectedScrollSnap());
    yogaApi.on("select", () => {
      setYogaIndex(yogaApi.selectedScrollSnap());
    });
  }, [yogaApi]);

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

  if (loading) {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Tabs defaultValue="yoga" className="w-full px-4 pt-4">
        <TabsList>
          <TabsTrigger value="yoga">Yoga</TabsTrigger>
          <TabsTrigger value="hiking">Hiking</TabsTrigger>
          <TabsTrigger value="pilates">Pilates</TabsTrigger>
        </TabsList>
        <TabsContent value="yoga">
          <div className="relative px-20">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setYogaApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {yogaData.map((activity, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className={`transition-opacity duration-300 ${index === yogaIndex ? "opacity-100" : "opacity-30"}`}
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
              <CarouselPrevious className="left-[25%]" />
              <CarouselNext className="right-[25%]" />
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
