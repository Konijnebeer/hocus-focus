import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Activity } from "@/database/activityDb";

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="min-h-md overflow-hidden rounded-md bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={activity.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription>{activity.description}</CardDescription>
      </CardFooter>
    </Card>
  );
}
