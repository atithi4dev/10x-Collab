import { useState } from 'react';
import { mockTeamPins, TeamPin } from '@/data/mockData';
import { PinCard } from '@/components/dashboard/PinCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/UserContext';
import { Plus, Clock, Check, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TeamPins() {
  const { currentUser } = useUser();
  const [pins, setPins] = useState<TeamPin[]>(mockTeamPins);
  const [newPinContent, setNewPinContent] = useState('');
  const [newPinStatus, setNewPinStatus] = useState<TeamPin['status']>('in-progress');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPin = () => {
    if (!newPinContent.trim()) return;
    
    const newPin: TeamPin = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: newPinContent,
      status: newPinStatus,
      likes: [],
      comments: [],
      timestamp: new Date(),
    };
    
    setPins(prev => [newPin, ...prev]);
    setNewPinContent('');
    setNewPinStatus('in-progress');
    setIsAdding(false);
  };

  const handleLike = (id: string) => {
    setPins(prev =>
      prev.map(pin => {
        if (pin.id === id) {
          const isLiked = pin.likes.includes(currentUser.id);
          return {
            ...pin,
            likes: isLiked
              ? pin.likes.filter(uid => uid !== currentUser.id)
              : [...pin.likes, currentUser.id],
          };
        }
        return pin;
      })
    );
  };

  const handleComplete = (id: string) => {
    setPins(prev =>
      prev.map(pin =>
        pin.id === id ? { ...pin, status: 'done' as const } : pin
      )
    );
  };

  const inProgressPins = pins.filter(p => p.status === 'in-progress');
  const donePins = pins.filter(p => p.status === 'done');
  const blockedPins = pins.filter(p => p.status === 'blocked');

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Progress Pins</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Share your status without interrupting anyone
          </p>
        </div>
        <Button
          variant="hero"
          size="sm"
          className="gap-2"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4" />
          New Pin
        </Button>
      </div>

      {/* Add New Pin */}
      {isAdding && (
        <div className="glass-card p-4 animate-scale-in">
          <Textarea
            placeholder="What are you working on?"
            value={newPinContent}
            onChange={(e) => setNewPinContent(e.target.value)}
            rows={2}
            className="mb-3"
          />
          <div className="flex items-center justify-between">
            <Select value={newPinStatus} onValueChange={(v) => setNewPinStatus(v as TeamPin['status'])}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="in-progress">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    In Progress
                  </div>
                </SelectItem>
                <SelectItem value="done">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Done
                  </div>
                </SelectItem>
                <SelectItem value="blocked">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                    Blocked
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button variant="hero" size="sm" onClick={handleAddPin}>
                Post Pin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pins by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In Progress */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold">In Progress</h2>
            <span className="text-sm text-muted-foreground">({inProgressPins.length})</span>
          </div>
          <div className="space-y-4">
            {inProgressPins.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                onLike={handleLike}
                onComplete={handleComplete}
              />
            ))}
            {inProgressPins.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No items in progress
              </p>
            )}
          </div>
        </div>

        {/* Blocked */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <h2 className="font-semibold">Blocked</h2>
            <span className="text-sm text-muted-foreground">({blockedPins.length})</span>
          </div>
          <div className="space-y-4">
            {blockedPins.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                onLike={handleLike}
                onComplete={handleComplete}
              />
            ))}
            {blockedPins.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No blockers — nice!
              </p>
            )}
          </div>
        </div>

        {/* Done */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold">Done</h2>
            <span className="text-sm text-muted-foreground">({donePins.length})</span>
          </div>
          <div className="space-y-4">
            {donePins.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                onLike={handleLike}
                onComplete={handleComplete}
              />
            ))}
            {donePins.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nothing completed yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
