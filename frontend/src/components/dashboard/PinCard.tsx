import { useState } from 'react';
import { TeamPin } from '@/data/mockData';
import { users, useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Check, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PinCardProps {
  pin: TeamPin;
  onLike?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const statusConfig = {
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  done: {
    label: 'Done',
    icon: Check,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  blocked: {
    label: 'Blocked',
    icon: AlertCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function PinCard({ pin, onLike, onComplete }: PinCardProps) {
  const { currentUser } = useUser();
  const pinUser = users.find(u => u.id === pin.userId);
  const isLiked = pin.likes.includes(currentUser.id);
  const status = statusConfig[pin.status];
  const StatusIcon = status.icon;
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="glass-card-hover p-4 animate-scale-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {pinUser?.avatar}
            </div>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
              `status-${pinUser?.status}`
            )} />
          </div>
          <div>
            <p className="text-sm font-medium">{pinUser?.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(pin.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-xs gap-1", status.className)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </Badge>
      </div>

      {/* Content */}
      <p className="text-sm mb-4 leading-relaxed">{pin.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 gap-1.5", isLiked && "text-pink-400")}
          onClick={() => onLike?.(pin.id)}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          <span className="text-xs">{pin.likes.length}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{pin.comments.length}</span>
        </Button>
        {pin.status !== 'done' && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 ml-auto text-emerald-400 hover:text-emerald-400"
            onClick={() => onComplete?.(pin.id)}
          >
            <Check className="w-4 h-4" />
            <span className="text-xs">Mark Done</span>
          </Button>
        )}
      </div>

      {/* Comments */}
      {showComments && pin.comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
          {pin.comments.map((comment, index) => {
            const commentUser = users.find(u => u.id === comment.userId);
            return (
              <div key={index} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-[10px] font-semibold shrink-0">
                  {commentUser?.avatar}
                </div>
                <div>
                  <p className="text-xs">
                    <span className="font-medium">{commentUser?.name}</span>
                    <span className="text-muted-foreground"> · {formatDistanceToNow(comment.timestamp, { addSuffix: true })}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
