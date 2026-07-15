'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-semibold">Admin Overview</h1>
        <div className="flex items-center space-x-4">
          <span>Logged in as Admin: {user?.name}</span>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow">
          <h3 className="text-lg text-slate-400">Total Users</h3>
          <p className="mt-2 text-4xl font-bold">1,248</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow">
          <h3 className="text-lg text-slate-400">Server Status</h3>
          <p className="mt-2 text-4xl font-bold text-green-400">Online</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow">
          <h3 className="text-lg text-slate-400">Active Sessions</h3>
          <p className="mt-2 text-4xl font-bold text-blue-400">42</p>
        </div>
      </div>
    </div>
  );
}
