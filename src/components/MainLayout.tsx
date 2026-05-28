
import React from 'react';
import {
    Users, Activity, Settings2, Zap, LogOut
} from 'lucide-react';
import { useMedicalStore } from '@/store/useDentalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router-dom';
import {  useLocation  } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
    { id: 'patients', href: '/patients', label: 'Patients', icon: Users },
    { id: 'aiAnalysis', href: '/ai-analysis', label: 'AI Analysis', icon: Activity },
    { id: 'settings', href: '/settings', label: 'Settings', icon: Settings2 },
] as const;

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { patientContext, fireQuickNormal } = useMedicalStore();
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const pathname = location.pathname;

    if (pathname?.startsWith('/auth')) {
        return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>;
    }

    // Check if we are in the detailed patient charting view
    const isChartingView = pathname?.match(/\/patients\/[^/]+$/);

    if (isChartingView) {
        return (
            <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-teal-100 selection:text-teal-900">
            {/* Sidebar Navigation */}
            <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm relative z-20">
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
                            Dental Hub
                        </span>
                    </div>
                </div>

                <div className="px-4 py-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Main Menu</div>
                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (pathname === '/' && item.id === 'patients');

                            return (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 w-full h-11 px-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                        isActive
                                            ? "bg-teal-50 text-teal-700 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors duration-200", 
                                        isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                                {user?.name?.substring(0, 2).toUpperCase() || 'DR'}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Doctor'}</span>
                                <span className="text-xs text-slate-500 font-medium">Dentist</span>
                            </div>
                            <button 
                                onClick={logout}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

                {/* Scrollable View Content */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
