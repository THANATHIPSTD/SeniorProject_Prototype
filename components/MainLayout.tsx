'use client';

import React from 'react';
import {
    LayoutDashboard, UserPlus, ClipboardList,
    Settings2, Activity, FileDown,
    Zap
} from 'lucide-react';
import { useDentalStore } from '@/store/useDentalStore';
import { cn } from '@/components/ClinicalExaminationForm';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patientEntry', label: 'Patient Entry', icon: UserPlus },
    { id: 'clinicalExam', label: 'Clinical Exam', icon: ClipboardList },
    { id: 'smartCharting', label: 'Smart Charting', icon: Settings2 },
    { id: 'aiAnalysis', label: 'AI Analysis', icon: Activity },
    { id: 'export', label: 'Export', icon: FileDown },
] as const;

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { activeView, setActiveView, patientContext, fireQuickNormal } = useDentalStore();

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SmartHub</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as any)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-teal-500/10 text-teal-400"
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-teal-400" : "text-slate-400")} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-teal-500 font-bold border border-slate-700">
                            DR
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">Dr. Smith</span>
                            <span className="text-xs text-slate-500">Prosthodontist</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative shadow-2xl z-10 rounded-l-2xl border-l border-slate-200">

                {/* Header: Fixed Patient Context */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Name:</span>
                            <span className="text-slate-900 font-bold">{patientContext.name}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">HN:</span>
                            <span className="text-slate-900">{patientContext.hn}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Age:</span>
                            <span className="text-slate-900">{patientContext.age}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300" />
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Date:</span>
                            <span className="text-slate-900">{patientContext.date}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fireQuickNormal}
                            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            <Zap className="w-4 h-4" />
                            Quick Normal
                        </button>
                    </div>
                </header>

                {/* Scrollable View Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative p-6">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
