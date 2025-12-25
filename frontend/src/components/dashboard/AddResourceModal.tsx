import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Resource, ResourceTag, tagColors } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const resourceTypes: Resource['type'][] = ['link', 'image', 'video', 'note', 'api', 'file', 'credentials'];
const availableTags: ResourceTag[] = ['API', 'UI', 'Backend', 'Research', 'Assets', 'Docs'];

interface AddResourceModalProps {
  onAdd: (resource: Omit<Resource, 'id' | 'timestamp' | 'addedBy' | 'pinned'>) => void;
}

export function AddResourceModal({ onAdd }: AddResourceModalProps) {
  const { currentUser } = useUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Resource['type']>('link');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<ResourceTag[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      description,
      type,
      url: url || undefined,
      content: content || undefined,
      tags: selectedTags,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('link');
    setUrl('');
    setContent('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: ResourceTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Select value={type} onValueChange={(v) => setType(v as Resource['type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Resource type" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {resourceTypes.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(type === 'link' || type === 'image' || type === 'video') && (
            <div>
              <Input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          {(type === 'note' || type === 'api') && (
            <div>
              <Textarea
                placeholder={type === 'api' ? 'API endpoint details (JSON)' : 'Note content'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
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
                  {selectedTags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
