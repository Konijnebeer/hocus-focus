import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  getAllActivities,
  resetActivities,
  type Activity,
} from "@/database/activityDb";
import { ActivityCarousel } from "./-components/activity-carousel";

export const Route = createFileRoute("/activity/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load activities from database on component mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        // Seed initial data if database is empty
        await resetActivities();
        // Get all activities from database
        const allActivities = await getAllActivities();
        setActivities(allActivities);
        setError(null);
      } catch (err) {
        console.error("Error loading activities:", err);
        setError("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // Helper function to get activities by category
  const getActivitiesByCategory = (category: string): Activity[] => {
    return activities.filter(
      (activity) =>
        activity.category === category && activity.status === "active",
    );
  };

  const [yogaData, setYogaData] = useState<Activity[]>([]);
  const [hikingData, setHikingData] = useState<Activity[]>([]);
  const [pilatesData, setPilatesData] = useState<Activity[]>([]);

  React.useEffect(() => {
    setYogaData(getActivitiesByCategory("yoga"));
    setHikingData(getActivitiesByCategory("hiking"));
    setPilatesData(getActivitiesByCategory("pilates"));
    console.log("Activities loaded:", activities);
  }, [activities]);

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
    <main className="min-h-screen">
      <Tabs defaultValue="yoga" className="w-full px-4 pt-4">
        <TabsList>
          <TabsTrigger value="yoga">Yoga</TabsTrigger>
          <TabsTrigger value="hiking">Hiking</TabsTrigger>
          <TabsTrigger value="pilates">Pilates</TabsTrigger>
        </TabsList>
        <TabsContent value="yoga">
          <ActivityCarousel
            activities={yogaData}
            prevButtonPosition="left-[30%]"
            nextButtonPosition="right-[30%]"
          />
        </TabsContent>
        <TabsContent value="hiking">
          <ActivityCarousel
            activities={hikingData}
            prevButtonPosition="left-[25%]"
            nextButtonPosition="right-[25%]"
          />
        </TabsContent>
        <TabsContent value="pilates">
          <ActivityCarousel
            activities={pilatesData}
            prevButtonPosition="left-[25%]"
            nextButtonPosition="right-[25%]"
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
