
import { useState } from 'react';
import {
    FileDown,
    AlertCircle, ActivitySquare, LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardExport() {
    const [exporting, setExporting] = useState<string | null>(null);

    const handleExport = (type: string) => {
        setExporting(type);
        setTimeout(() => {
            setExporting(null);
            alert(`Successfully exported ${type}!`);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Patient Dashboard</h2>
                <p className="text-slate-500">Summary of the clinical examination, charting, and AI diagnostics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Summary Card 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Critical Findings</h3>
                    </div>
                    <ul className="space-y-3 flex-1">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span><strong>3 Missing Teeth</strong> (46, 36, 14)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span>High Mobility Risk in Mandibular Anterior</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            <span>Class II Alveolar Bone Loss</span>
                        </li>
                    </ul>
                </div>

                {/* Summary Card 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <ActivitySquare className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Esthetic & TMJ</h3>
                    </div>
                    <ul className="space-y-3 flex-1">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                            <span><strong>High Smile Line</strong> with average lip thickness</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                            <span><strong>Left Shift</strong> midline discrepancy (2mm)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                            <span>Clicking joint sound with 45mm opening</span>
                        </li>
                    </ul>
                </div>

                {/* Summary Card 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Ridge & Soft Tissue</h3>
                    </div>
                    <ul className="space-y-3 flex-1">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span><strong>Knife edge</strong> ridge height</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span><strong>V shape</strong> palatal vault</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span>Exacting mental attitude (House Class II)</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-4">
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Actions & Export</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => handleExport('PDF')}
                        disabled={exporting !== null}
                        className={cn(
                            "flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 transition-all group",
                            exporting === 'PDF'
                                ? "border-teal-200 bg-teal-50"
                                : "border-slate-200 hover:border-teal-500 hover:bg-teal-50"
                        )}
                    >
                        <FileDown className={cn("w-10 h-10", exporting === 'PDF' ? "text-teal-500 animate-bounce" : "text-slate-400 group-hover:text-teal-500")} />
                        <span className="font-bold text-slate-700">Export Patient PDF</span>
                        <span className="text-xs text-slate-500 text-center">Comprehensive report including clinical form, charting, and AI metrics.</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
