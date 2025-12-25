import { useState } from 'react';
import { mockFileActivities, FileActivity } from '@/data/mockData';
import { users } from '@/contexts/UserContext';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LiveActivity() {
  const [activities] = useState<FileActivity[]>(mockFileActivities);

  const activeCount = activities.filter(a => a.action === 'editing').length;
  const reviewingCount = activities.filter(a => a.action === 'reviewing').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Live File Activity</h1>
        <p className="text-muted-foreground text-sm mt-1">
          See what your teammates are working on in real-time
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full status-online" />
          <span className="text-sm text-muted-foreground">{activeCount} actively editing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full status-idle" />
          <span className="text-sm text-muted-foreground">{reviewingCount} reviewing</span>
        </div>
      </div>

      {/* Team Overview */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold mb-4">Team Members</h3>
        <div className="flex flex-wrap gap-3">
          {users.map((user) => {
            const activity = activities.find(a => a.userId === user.id);
            return (
              <div
                key={user.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {user.avatar}
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-secondary",
                    `status-${user.status}`
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  {activity && (
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {activity.fileName}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Current Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      {/* Mock Live Preview */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Live Preview</h3>
          <Badge variant="outline" className="text-xs gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
        <div className="aspect-video rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Select a team member to preview their work</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Click "View File" on any activity card</p>
          </div>
        </div>
      </div>
    </div>
  );
}
