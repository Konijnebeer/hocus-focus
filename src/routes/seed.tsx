import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getUserCount, resetUsers } from "@/database/userDb";
import { getActivityCount, resetActivities } from "@/database/activityDb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/seed")({
  component: RouteComponent,
});

function RouteComponent() {
  const [userStatus, setUserStatus] = useState<
    "idle" | "seeding" | "success" | "error"
  >("idle");
  const [activityStatus, setActivityStatus] = useState<
    "idle" | "seeding" | "success" | "error"
  >("idle");
  const [userMessage, setUserMessage] = useState("");
  const [activityMessage, setActivityMessage] = useState("");
  const [userCount, setUserCount] = useState<number | null>(null);
  const [activityCount, setActivityCount] = useState<number | null>(null);

  useEffect(() => {
    // Check current counts on mount
    getUserCount()
      .then(setUserCount)
      .catch(() => setUserCount(null));
    getActivityCount()
      .then(setActivityCount)
      .catch(() => setActivityCount(null));
  }, []);

  const handleSeedUsers = async () => {
    try {
      setUserStatus("seeding");
      setUserMessage("Seeding users...");

      await resetUsers();

      const count = await getUserCount();
      setUserCount(count);
      setUserStatus("success");
      setUserMessage(`Successfully seeded users! Total users: ${count}`);
    } catch (error) {
      setUserStatus("error");
      setUserMessage(
        `Error seeding users: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleSeedActivities = async () => {
    try {
      setActivityStatus("seeding");
      setActivityMessage("Seeding activities...");

      await resetActivities();

      const count = await getActivityCount();
      setActivityCount(count);
      setActivityStatus("success");
      setActivityMessage(
        `Successfully seeded activities! Total activities: ${count}`,
      );
    } catch (error) {
      setActivityStatus("error");
      setActivityMessage(
        `Error seeding activities: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleSeedAll = async () => {
    await handleSeedUsers();
    await handleSeedActivities();
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seed All Button */}
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Seed both users and activities at once.
            </p>
            <Button
              onClick={handleSeedAll}
              disabled={
                userStatus === "seeding" || activityStatus === "seeding"
              }
              className="w-full"
              variant="default"
            >
              {userStatus === "seeding" || activityStatus === "seeding"
                ? "Seeding..."
                : "Seed All"}
            </Button>
          </div>

          <Separator />

          {/* Users Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Users</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Seed the user database with initial data if it's empty.
              </p>
              {userCount !== null && (
                <p className="text-sm">
                  Current user count: <strong>{userCount}</strong>
                </p>
              )}
            </div>

            <Button
              onClick={handleSeedUsers}
              disabled={userStatus === "seeding"}
              className="w-full"
              variant="secondary"
            >
              {userStatus === "seeding" ? "Seeding..." : "Seed Users"}
            </Button>

            {userMessage && (
              <div
                className={`p-4 rounded-lg ${
                  userStatus === "success"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : userStatus === "error"
                      ? "bg-red-500/10 text-red-700 dark:text-red-400"
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                }`}
              >
                {userMessage}
              </div>
            )}
          </div>

          <Separator />

          {/* Activities Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Activities</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Seed the activity database with initial data if it's empty.
              </p>
              {activityCount !== null && (
                <p className="text-sm">
                  Current activity count: <strong>{activityCount}</strong>
                </p>
              )}
            </div>

            <Button
              onClick={handleSeedActivities}
              disabled={activityStatus === "seeding"}
              className="w-full"
              variant="secondary"
            >
              {activityStatus === "seeding" ? "Seeding..." : "Seed Activities"}
            </Button>

            {activityMessage && (
              <div
                className={`p-4 rounded-lg ${
                  activityStatus === "success"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : activityStatus === "error"
                      ? "bg-red-500/10 text-red-700 dark:text-red-400"
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                }`}
              >
                {activityMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
