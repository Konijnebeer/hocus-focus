import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

// ActivityCard component Data
export type ActivityCardProps = {
  activity: {
    title: string;
    description: string;
    imageUrl: string;
  };
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-md">
          <img src={activity.imageUrl} alt={activity.title} />
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription>{activity.description}</CardDescription>
      </CardFooter>
    </Card>
  );
}
