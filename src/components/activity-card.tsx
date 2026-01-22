import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Activity } from "@/database/activityDb";
import { Calendar, Clock, Timer, Users, Image } from "lucide-react";

// ActivityCard component Data
export type ActivityCardProps = {
  activity:
    | Activity
    | {
        title: string;
        description: string;
        image?: string;
        imageUrl?: string;
      };
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  // Handle both old format (imageUrl) and new format (image)
  const imageUrl = "image" in activity ? activity.image : activity.imageUrl;

  // Extract activity details if available
  const date = "date" in activity ? activity.date : undefined;
  const hour = "hour" in activity ? activity.hour : undefined;
  const numParticipants =
    "numParticipants" in activity ? activity.numParticipants : undefined;
  const duration = "duration" in activity ? activity.duration : undefined;

  return (
    <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Header - Title */}
      <CardHeader className="pb-6 px-6">
        <CardTitle className="text-xl font-bold">{activity.title}</CardTitle>
      </CardHeader>

      {/* Image Section */}
      <CardContent className="px-6 pb-4">
        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 h-40">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/40">
              <Image className="w-8 h-8 text-secondary" />
            </div>
          )}
        </div>
      </CardContent>

      {/* Info Badges */}
      <CardContent className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {date && (
            <span className="inline-flex items-center gap-1.5 bg-primary text-secondary text-sm px-3 py-2 rounded-full font-medium">
              <Calendar className="w-4 h-4" /> {date}
            </span>
          )}
          {hour && (
            <span className="inline-flex items-center gap-1.5 bg-primary text-secondary text-sm px-3 py-2 rounded-full font-medium">
              <Clock className="w-4 h-4" /> {hour}
            </span>
          )}
          {duration && (
            <span className="inline-flex items-center gap-1.5 bg-primary text-secondary text-sm px-3 py-2 rounded-full font-medium">
              <Timer className="w-4 h-4" /> {duration}m
            </span>
          )}
          {numParticipants !== undefined && (
            <span className="inline-flex items-center gap-1.5 bg-primary text-secondary text-sm px-3 py-2 rounded-full font-medium">
              <Users className="w-4 h-4" /> {numParticipants}
            </span>
          )}
        </div>
      </CardContent>

      {/* Description - Footer */}
      <CardFooter className="flex-grow pt-4">
        <CardDescription className="text-sm line-clamp-4 text-secondary">
          {activity.description}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
