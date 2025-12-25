import { useState, useMemo, useCallback } from 'react';
import { mockResources, Resource, ResourceTag, tagColors } from '@/data/mockData';
import { ResourceCard } from '@/components/dashboard/ResourceCard';
import { AddResourceModal } from '@/components/dashboard/AddResourceModal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Pin, Upload, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const allTags: ResourceTag[] = ['API', 'UI', 'Backend', 'Research', 'Assets', 'Docs'];

export default function Marketplace() {
  const { currentUser } = useUser();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<ResourceTag[]>([]);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.some(tag => resource.tags.includes(tag));
      
      const matchesPinned = !showPinnedOnly || resource.pinned;

      return matchesSearch && matchesTags && matchesPinned;
    });
  }, [resources, searchQuery, selectedTags, showPinnedOnly]);

  const pinnedResources = filteredResources.filter(r => r.pinned);
  const unpinnedResources = filteredResources.filter(r => !r.pinned);

  const handleAddResource = (newResource: Omit<Resource, 'id' | 'timestamp' | 'addedBy' | 'pinned'>) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      timestamp: new Date(),
      addedBy: currentUser.id,
      pinned: false,
    };
    setResources(prev => [resource, ...prev]);
  };

  const handleTogglePin = (id: string) => {
    setResources(prev =>
      prev.map(r => r.id === id ? { ...r, pinned: !r.pinned } : r)
    );
  };

  const toggleTag = (tag: ResourceTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) {
      toast.error('Please drop image or video files only');
      return;
    }

    validFiles.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);

      const newResource: Resource = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: `${isImage ? 'Image' : 'Video'} uploaded via drag & drop`,
        type: isImage ? 'image' : 'video',
        url: url,
        tags: ['Assets'] as ResourceTag[],
        addedBy: currentUser.id,
        timestamp: new Date(),
        pinned: false,
      };

      setResources(prev => [newResource, ...prev]);
    });

    toast.success(`Added ${validFiles.length} resource${validFiles.length > 1 ? 's' : ''}`);
  }, [currentUser.id]);

  return (
    <div 
      className={cn(
        "p-6 space-y-6 animate-fade-in min-h-full transition-all duration-200",
        isDragging && "bg-primary/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="glass-card p-12 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop files here</h3>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Image className="w-4 h-4" /> Images
              <span className="text-muted-foreground/50">•</span>
              <Video className="w-4 h-4" /> Videos
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your team's central resource hub — drag & drop images/videos to add
          </p>
        </div>
        <AddResourceModal onAdd={handleAddResource} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer transition-all gap-1",
              showPinnedOnly ? "bg-primary/10 text-primary border-primary/30" : "opacity-70 hover:opacity-100"
            )}
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
          >
            <Pin className="w-3 h-3" />
            Pinned
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "cursor-pointer transition-all",
                selectedTags.includes(tag) ? tagColors[tag] : "opacity-50 hover:opacity-100"
              )}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pinned Resources */}
      {pinnedResources.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Pinned Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pinnedResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div>
        {pinnedResources.length > 0 && (
          <h2 className="font-semibold mb-4">All Resources</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {unpinnedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onPin={handleTogglePin}
            />
          ))}
        </div>
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No resources found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
