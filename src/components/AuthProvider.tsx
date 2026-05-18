
import { useAuthStore } from '@/store/useAuthStore';
import {  useNavigate, useLocation  } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isAuthRoute = pathname?.startsWith('/auth');
    if (!isAuthenticated && !isAuthRoute) {
      navigate('/auth/login');
    } else if (isAuthenticated && isAuthRoute) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, pathname, navigate, mounted]);

  // Prevent flash of incorrect content during hydration
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading IDRS...</div>;
  }

  return <>{children}</>;
}
