'use client';

import { useGetProducts } from '@/features/product/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Fetch products (page 1, limit 10)
  const { data, isLoading, error } = useGetProducts({ page: 1, limit: 10 });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Intern Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {user?.name || 'Intern'}!</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List (API Example)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading products from backend...</p>}
          {error && (
            <p className="text-red-500">Failed to load products. Did you start the backend?</p>
          )}

          {data && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 border-b p-2 font-semibold">
                <div>ID</div>
                <div>Name</div>
                <div>Price</div>
                <div>Stock</div>
              </div>
              {data.data.map((product) => (
                <div key={product.id} className="grid grid-cols-4 items-center border-b p-2">
                  <div>#{product.id}</div>
                  <div className="font-medium">{product.name}</div>
                  <div>Rp {product.price.toLocaleString()}</div>
                  <div>{product.stock} pcs</div>
                </div>
              ))}
              <div className="pt-4 text-sm text-gray-500">
                Showing page {data.meta.page} of {data.meta.lastPage} (Total: {data.meta.total}{' '}
                products)
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
