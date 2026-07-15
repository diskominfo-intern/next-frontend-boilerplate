'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Basic protection check
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* User Sidebar */}
      <aside className="w-64 border-r bg-white p-6 shadow-sm">
        <h2 className="mb-8 text-xl font-bold text-blue-600">INTERN APP</h2>
        <nav className="space-y-4">
          <p className="cursor-pointer text-gray-600 hover:text-blue-600">Dashboard</p>
          <p className="cursor-pointer text-gray-600 hover:text-blue-600">My Profile</p>
          <p className="cursor-pointer text-gray-600 hover:text-blue-600">Orders</p>
        </nav>
      </aside>

      {/* User Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
