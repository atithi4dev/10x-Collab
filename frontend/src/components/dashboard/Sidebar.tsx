import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Zap, LayoutGrid, Activity, Pin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserSwitcher } from './UserSwitcher';

const navItems = [
  { icon: LayoutGrid, label: 'Marketplace', path: '/dashboard' },
  { icon: Activity, label: 'Live Activity', path: '/dashboard/activity' },
  { icon: Pin, label: 'Team Pins', path: '/dashboard/pins' },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
        "sticky top-0 h-screen glass-card border-r flex flex-col transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64"
    )}
     >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold">SyncForge</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Switcher */}
      <div className="p-3 border-t border-border/50">
        <UserSwitcher collapsed={collapsed} />
      </div>
    </aside>
  );
}
