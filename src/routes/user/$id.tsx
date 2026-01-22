import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getUser } from '@/database/userDb'
import { getActivitiesByCreator } from '@/database/activityDb'
import type { User } from '@/database/userDb'
import type { Activity } from '@/database/activityDb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/user/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        const userData = await getUser(id)
        if (userData) {
          setUser(userData)
          const userActivities = await getActivitiesByCreator(id)
          setActivities(userActivities)
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center">User not found</p>
      </div>
    )
  }

  return (
    <main className="h-[70vh] container mx-auto p-6 max-w-6xl">
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
                    {user.name[0]}{user.surname[0]}
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
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
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
                {user.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>

          {/* Activities Section */}
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
                      <Card key={activity.id} className="border-l-4 border-l-primary">
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
                                    activity.status === 'active' 
                                      ? 'default' 
                                      : activity.status === 'completed' 
                                      ? 'secondary' 
                                      : 'destructive'
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
                                <span>📍 {activity.location}</span>
                                <span>•</span>
                                <span>📅 {activity.date}</span>
                                <span>•</span>
                                <span>⏱️ {activity.duration} min</span>
                                <span>•</span>
                                <span>👥 {activity.numParticipants} participants</span>
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
  )
}
