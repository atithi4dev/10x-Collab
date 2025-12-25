import { FileActivity } from '@/data/mockData';
import { users } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { FileCode, GitBranch, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface ActivityCardProps {
  activity: FileActivity;
}

const actionColors = {
  editing: 'text-emerald-400',
  reviewing: 'text-amber-400',
  idle: 'text-muted-foreground',
};

const actionLabels = {
  editing: 'Currently editing',
  reviewing: 'Reviewing',
  idle: 'Idle',
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const user = users.find(u => u.id === activity.userId);

  return (
    <div className="glass-card-hover p-4 animate-slide-in">
      <div className="flex items-start gap-4">
        {/* User avatar with status */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {user?.avatar}
          </div>
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
            `status-${user?.status}`
          )} />
        </div>

        {/* Activity info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{user?.name}</h4>
            <span className={cn("text-xs font-medium", actionColors[activity.action])}>
              {actionLabels[activity.action]}
            </span>
          </div>

          {/* File info */}
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileCode className="w-4 h-4 shrink-0" />
            <span className="text-sm font-mono truncate">{activity.fileName}</span>
          </div>

          {/* Branch info */}
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <GitBranch className="w-4 h-4 shrink-0" />
            <span className="text-xs font-mono truncate">{activity.branch}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(activity.lastUpdate, { addSuffix: true })}
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              View File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
