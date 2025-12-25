import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <Outlet />
      </main>
    </div>
  );
}
