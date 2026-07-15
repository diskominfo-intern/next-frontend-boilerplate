'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Basic protection check
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'ADMIN') {
      alert('Access Denied. Admins only.');
      router.push('/user/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-700 bg-slate-800 p-6">
        <h2 className="mb-8 text-xl font-bold text-blue-400">ADMIN PANEL</h2>
        <nav className="space-y-4">
          <p className="cursor-pointer hover:text-blue-300">Dashboard</p>
          <p className="cursor-pointer hover:text-blue-300">Manage Users</p>
          <p className="cursor-pointer hover:text-blue-300">System Settings</p>
        </nav>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
