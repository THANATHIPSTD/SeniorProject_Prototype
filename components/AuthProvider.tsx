'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isAuthRoute = pathname?.startsWith('/auth');
    if (!isAuthenticated && !isAuthRoute) {
      router.push('/auth/login');
    } else if (isAuthenticated && isAuthRoute) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router, mounted]);

  // Prevent flash of incorrect content during hydration
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading IDRS...</div>;
  }

  return <>{children}</>;
}
