import { Resource, tagColors, ResourceTag } from '@/data/mockData';
import { users } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Link2, Image, Video, FileText, Code, File, Key, Pin, ExternalLink, GripVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const typeIcons: Record<Resource['type'], React.ReactNode> = {
  link: <Link2 className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
  api: <Code className="w-4 h-4" />,
  file: <File className="w-4 h-4" />,
  credentials: <Key className="w-4 h-4" />,
};

interface ResourceCardProps {
  resource: Resource;
  onPin?: (id: string) => void;
}

export function ResourceCard({ resource, onPin }: ResourceCardProps) {
  const addedByUser = users.find(u => u.id === resource.addedBy);

  return (
    <div className={cn(
      "glass-card-hover p-4 group relative animate-scale-in",
      resource.pinned && "ring-1 ring-primary/30"
    )}>
      {/* Drag handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
              {typeIcons[resource.type]}
            </div>
            <div>
              <h3 className="font-medium text-sm leading-tight">{resource.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(resource.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 group"
              onClick={() => onPin?.(resource.id)}
            >
              <Pin
                className={cn(
                  "w-3.5 h-3.5 transition-colors"
                )}
              />
            </Button>

            {resource.url && (
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {resource.description}
        </p>

        {/* Code preview for API type */}
        {resource.type === 'api' && resource.content && (
          <pre className="text-xs bg-secondary/50 rounded-lg p-3 mb-3 overflow-x-auto font-mono scrollbar-thin">
            {resource.content}
          </pre>
        )}

        {/* Note preview */}
        {resource.type === 'note' && resource.content && (
          <div className="text-xs bg-secondary/50 rounded-lg p-3 mb-3 whitespace-pre-wrap">
            {resource.content}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {resource.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn("text-xs px-2 py-0.5", tagColors[tag])}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-semibold">
              {addedByUser?.avatar}
            </div>
            <span className="text-xs text-muted-foreground">{addedByUser?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
