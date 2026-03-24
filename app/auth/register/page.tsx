'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = useAuthStore((state: any) => state.login);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      // Mock registration sequence mapping directly to login
      login(
        { id: '1', name, email, role: 'dentist' },
        'mock-jwt-token-idrs-NEW'
      );
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create IDRS Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Intelligent Dental Record System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Dr. John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="doctor@clinic.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md text-base"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Already registered?</span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/auth/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
