import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getUser, seedUsers } from "@/database/userDb";
import { getActivitiesByCreator, getActivity } from "@/database/activityDb";
import { getUserActivities } from "@/database/participantDb";
import type { User } from "@/database/userDb";
import type { Activity } from "@/database/activityDb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Timer, Users } from "lucide-react";

export const Route = createFileRoute("/user/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [joinedActivities, setJoinedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        // Ensure database is seeded before fetching user
        await seedUsers();
        const userData = await getUser(id);
        if (userData) {
          setUser(userData);
          const userActivities = await getActivitiesByCreator(id);
          setActivities(userActivities);

          // Get activities the user has joined
          const participations = await getUserActivities(id);
          const joined = await Promise.all(
            participations.map(async (p) => {
              const activity = await getActivity(p.activityId);
              return activity;
            }),
          );
          setJoinedActivities(
            joined.filter((a): a is Activity => a !== undefined),
          );

          // Check if this is the logged-in user's profile
          const loggedInUserId = localStorage.getItem("loggedInUserId");
          setIsOwnProfile(loggedInUserId === id);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUserId");
    navigate({ to: "/login" });
  };

  if (loading) {
    return (
      <main className="h-[70vh] container mx-auto p-6">
        <p className="text-center">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="h-[70vh] container mx-auto p-6">
        <p className="text-center">User not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] h-fit container mx-auto p-6 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Profile Info */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-4 overflow-hidden">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={`${user.name} ${user.surname}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    {user.name[0]}
                    {user.surname[0]}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {user.name} {user.surname}
              </h1>
              {user.role && (
                <Badge variant="secondary" className="mb-4">
                  {user.role}
                </Badge>
              )}
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - About and Activities */}
        <div className="md:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {user.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Joined Activities Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                Joined Activities ({joinedActivities.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {joinedActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No activities joined yet.
                </p>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {joinedActivities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            {activity.image && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                <img
                                  src={activity.image}
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-base line-clamp-1">
                                  {activity.title}
                                </h3>
                                <Badge
                                  variant={
                                    activity.status === "active"
                                      ? "default"
                                      : activity.status === "completed"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="flex-shrink-0"
                                >
                                  {activity.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {activity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{" "}
                                  {activity.location}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />{" "}
                                  {activity.date}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Timer className="w-3 h-3" />{" "}
                                  {activity.duration} min
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Users className="w-3 h-3" />{" "}
                                  {activity.numParticipants} participants
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Created Activities Section */}
          <Card>
            <CardHeader>
              <CardTitle>Created Activities ({activities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No activities created yet.
                </p>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            {activity.image && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                <img
                                  src={activity.image}
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-base line-clamp-1">
                                  {activity.title}
                                </h3>
                                <Badge
                                  variant={
                                    activity.status === "active"
                                      ? "default"
                                      : activity.status === "completed"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="flex-shrink-0"
                                >
                                  {activity.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {activity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{" "}
                                  {activity.location}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />{" "}
                                  {activity.date}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Timer className="w-3 h-3" />{" "}
                                  {activity.duration} min
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Users className="w-3 h-3" />{" "}
                                  {activity.numParticipants} participants
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
