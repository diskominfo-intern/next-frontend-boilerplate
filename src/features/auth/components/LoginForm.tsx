'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data: unknown) => {
          // Asumsi backend mengirim role di data.data.user.role
          // Jika tidak ada, default ke USER
          const res = data as { data?: { user?: { role?: string } } };
          const role = res?.data?.user?.role || 'USER';

          if (role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/user/dashboard');
          }
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          alert(err?.response?.data?.message || 'Login failed');
        },
      }
    );
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="intern@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
