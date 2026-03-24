'use client';

import React from 'react';
import {
    Users, Activity, Settings2, Zap, LogOut
} from 'lucide-react';
import { useDentalStore } from '@/store/useDentalStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    const { patientContext, fireQuickNormal } = useDentalStore();
    const { user, logout } = useAuthStore();
    const pathname = usePathname();

    if (pathname?.startsWith('/auth')) {
        return <div className="min-h-screen bg-slate-50">{children}</div>;
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
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">IDRS</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "w-full justify-start gap-3 h-10 px-3 text-sm font-medium",
                                    isActive
                                        ? "bg-teal-500/10 text-teal-400 hover:bg-teal-500/15 hover:text-teal-400"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-teal-400" : "text-slate-400")} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <Separator className="bg-slate-800" />
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-teal-500 font-bold border border-slate-700">
                            {user?.name?.substring(0, 2).toUpperCase() || 'DR'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white truncate max-w-[100px]">{user?.name || 'Doctor'}</span>
                            <span className="text-xs text-slate-500">Dentist</span>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative shadow-2xl z-10 rounded-l-2xl border-l border-slate-200">

                {/* Header: Fixed Patient Context */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className="gap-1.5 font-normal">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-bold text-slate-900">{patientContext.name}</span>
                        </Badge>
                        <Badge variant="outline" className="gap-1.5 font-normal">
                            <span className="text-muted-foreground">HN:</span>
                            <span className="text-slate-900">{patientContext.hn}</span>
                        </Badge>
                        <Badge variant="outline" className="gap-1.5 font-normal">
                            <span className="text-muted-foreground">Age:</span>
                            <span className="text-slate-900">{patientContext.age}</span>
                        </Badge>
                        <Badge variant="outline" className="gap-1.5 font-normal">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="text-slate-900">{patientContext.date}</span>
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={fireQuickNormal}
                            size="lg"
                            className="bg-teal-500 hover:bg-teal-600 text-white shadow-sm"
                        >
                            <Zap className="w-4 h-4" />
                            Quick Normal
                        </Button>
                    </div>
                </header>

                {/* Scrollable View Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative p-6">
                    <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
