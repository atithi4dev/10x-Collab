import { useUser, users } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface UserSwitcherProps {
  collapsed?: boolean;
}

export function UserSwitcher({ collapsed }: UserSwitcherProps) {
  const { currentUser, setCurrentUser } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-secondary",
        collapsed && "justify-center px-0"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0",
          `status-${currentUser.status}`
        )}>
          {currentUser.avatar}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Switch User
        </div>
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => setCurrentUser(user)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              currentUser.id === user.id && "bg-primary/10"
            )}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                {user.avatar}
              </div>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-popover",
                `status-${user.status}`
              )} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
