import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getActivity } from "@/database/activityDb";
import { getUser } from "@/database/userDb";
import {
  getActivityParticipants,
  addParticipant,
  removeParticipant,
  isUserParticipant,
} from "@/database/participantDb";
import type { Activity } from "@/database/activityDb";
import type { User } from "@/database/userDb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Timer,
  Users,
  MapPin,
  Image,
  User as UserIcon,
  UserPlus,
  UserMinus,
} from "lucide-react";

export const Route = createFileRoute("/activity/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Get current logged-in user from localStorage
  useEffect(() => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
      setCurrentUserId(loggedInUserId);
    }
  }, []);

  // Load activity data
  useEffect(() => {
    async function loadActivityData() {
      try {
        setLoading(true);

        // Get activity
        const activityData = await getActivity(id);
        if (!activityData) {
          console.error("Activity not found");
          setLoading(false);
          return;
        }
        setActivity(activityData);

        // Get creator
        const creatorData = await getUser(activityData.creatorId);
        setCreator(creatorData || null);

        // Get participants
        const participantRecords = await getActivityParticipants(id);
        const participantUsers = await Promise.all(
          participantRecords.map(async (p) => {
            const user = await getUser(p.userId);
            return user;
          }),
        );
        setParticipants(
          participantUsers.filter((u): u is User => u !== undefined),
        );

        // Check if current user is a participant
        if (currentUserId) {
          const isJoined = await isUserParticipant(currentUserId, id);
          setIsParticipant(isJoined);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading activity data:", error);
        setLoading(false);
      }
    }

    loadActivityData();
  }, [id, currentUserId]);

  const handleJoinLeave = async () => {
    if (!currentUserId || !activity) return;

    try {
      setIsJoining(true);

      if (isParticipant) {
        // Leave activity
        await removeParticipant(currentUserId, id);
        setIsParticipant(false);

        // Update participants list
        setParticipants((prev) => prev.filter((p) => p.id !== currentUserId));
      } else {
        // Join activity
        await addParticipant(currentUserId, id);
        setIsParticipant(true);

        // Update participants list
        const currentUser = await getUser(currentUserId);
        if (currentUser) {
          setParticipants((prev) => [...prev, currentUser]);
        }
      }
    } catch (error) {
      console.error("Error joining/leaving activity:", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Activity Not Found</CardTitle>
            <CardDescription>
              The activity you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isCreator = currentUserId === activity.creatorId;
  const canJoinLeave = currentUserId && !isCreator;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Activity Header */}
        <Card className="mb-6 bg-primary text-primary-foreground border-primary shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {activity.title}
                </CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {activity.category}
                </Badge>
              </div>
              {canJoinLeave ? (
                <Button
                  onClick={handleJoinLeave}
                  disabled={isJoining}
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isParticipant ? (
                    <>
                      <UserMinus className="w-5 h-5" />
                      Leave Activity
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Join Activity
                    </>
                  )}
                </Button>
              ) : (
                !isCreator && (
                  <Link to="/signup">
                    <Button size="lg" variant="secondary">
                      Create Account
                    </Button>
                  </Link>
                )
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Activity Image */}
        <Card className="mb-6 overflow-hidden bg-primary border-primary p-0 border-0">
          <CardContent className="p-0">
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-primary/40">
              {activity.image ? (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-16 h-16 text-primary-foreground/50" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Details */}
        <Card className="mb-6 bg-primary text-primary-foreground border-primary">
          <CardHeader>
            <CardTitle className="text-xl">Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Date</p>
                  <p className="font-medium">{activity.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Time</p>
                  <p className="font-medium">{activity.hour}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Duration</p>
                  <p className="font-medium">{activity.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">Location</p>
                  <p className="font-medium">{activity.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-sm text-primary-foreground/70">
                    Participants
                  </p>
                  <p className="font-medium">
                    {participants.length} / {activity.numParticipants}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Description */}
        <Card className="mb-6 bg-primary text-primary-foreground border-primary">
          <CardHeader>
            <CardTitle className="text-xl">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-foreground/90 leading-relaxed">
              {activity.description}
            </p>
          </CardContent>
        </Card>

        {/* Activity Creator */}
        {creator && (
          <Card className="mb-6 bg-primary text-primary-foreground border-primary">
            <CardHeader>
              <CardTitle className="text-xl">Organized By</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/user/$id" params={{ id: creator.id }}>
                <Item
                  variant="muted"
                  className="bg-primary/50 hover:bg-primary/70 cursor-pointer border-primary-foreground/20"
                >
                  <ItemMedia variant="image">
                    {creator.picture ? (
                      <img
                        src={creator.picture}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-foreground/10">
                        <UserIcon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-primary-foreground">
                      {creator.name} {creator.surname}
                    </ItemTitle>
                    {creator.role && (
                      <ItemDescription className="text-primary-foreground/70">
                        {creator.role}
                      </ItemDescription>
                    )}
                  </ItemContent>
                </Item>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Participants List */}
        {participants.length > 0 && (
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader>
              <CardTitle className="text-xl">
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                {participants.map((participant, index) => (
                  <div key={participant.id}>
                    {index > 0 && (
                      <ItemSeparator className="bg-primary-foreground/20 my-3" />
                    )}
                    <Link
                      to="/user/$id"
                      params={{ id: participant.id }}
                      className="block"
                    >
                      <Item
                        variant="muted"
                        className="bg-primary/50 hover:bg-primary/70 cursor-pointer border-primary-foreground/20"
                      >
                        <ItemMedia variant="image">
                          {participant.picture ? (
                            <img
                              src={participant.picture}
                              alt={participant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-foreground/10">
                              <UserIcon className="w-6 h-6 text-primary-foreground" />
                            </div>
                          )}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="text-primary-foreground">
                            {participant.name} {participant.surname}
                          </ItemTitle>
                          {participant.role && (
                            <ItemDescription className="text-primary-foreground/70">
                              {participant.role}
                            </ItemDescription>
                          )}
                        </ItemContent>
                      </Item>
                    </Link>
                  </div>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
