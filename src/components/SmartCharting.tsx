
import { useState } from 'react';
import {
    Stethoscope, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OdontogramUI from '@/components/odontogram/OdontogramUI';



// Data structure for Occlusal Analysis matrix
type OcclusalCategory = 'premature' | 'mip' | 'protrusive' | 'working' | 'nonWorking';

const OCCLUSAL_CATEGORIES: { id: OcclusalCategory, label: string }[] = [
    { id: 'premature', label: 'Premature contact' },
    { id: 'mip', label: 'MIP contact' },
    { id: 'protrusive', label: 'Protrusive contact' },
    { id: 'working', label: 'Working side contact' },
    { id: 'nonWorking', label: 'Non working side contact' },
];

const INITIAL_OCCLUSAL_STATE: Record<OcclusalCategory, number[]> = {
    premature: [], mip: [], protrusive: [], working: [], nonWorking: []
};

// Quadrants for the matrix layout
const Q1 = [18, 17, 16, 15, 14, 13, 12, 11];
const Q2 = [21, 22, 23, 24, 25, 26, 27, 28];
const Q4 = [48, 47, 46, 45, 44, 43, 42, 41];
const Q3 = [31, 32, 33, 34, 35, 36, 37, 38];



export default function SmartCharting() {
    const [activeTab, setActiveTab] = useState<'chart' | 'occlusal'>('chart');


    // Occlusal Analysis State
    const [occlusalData, setOcclusalData] = useState(INITIAL_OCCLUSAL_STATE);



    const handleOcclusalToggle = (category: OcclusalCategory, id: number) => {
        setOcclusalData(prev => {
            const arr = prev[category];
            if (arr.includes(id)) {
                return { ...prev, [category]: arr.filter(t => t !== id) };
            }
            return { ...prev, [category]: [...arr, id] };
        });
    };



    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Header Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex flex-wrap items-center gap-4 bg-slate-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setActiveTab('chart')}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm",
                            activeTab === 'chart'
                                ? "bg-white text-slate-800 ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-700 shadow-none border border-transparent"
                        )}
                    >
                        <Stethoscope className="w-4 h-4" />
                        Dental Status
                    </button>
                    <button
                        onClick={() => setActiveTab('occlusal')}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm",
                            activeTab === 'occlusal'
                                ? "bg-white text-indigo-700 ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-700 shadow-none border border-transparent"
                        )}
                    >
                        <Settings2 className="w-4 h-4" />
                        Occlusal Analysis
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* Main Workspace */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start">

                    {activeTab === 'chart' ? (
                        <div className="w-full h-full flex flex-col relative">
                            <OdontogramUI />
                        </div>
                    ) : (
                        <div className="w-full max-w-5xl">
                            <div className="mb-8 text-center sm:text-left">
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3 justify-center sm:justify-start">
                                    Occlusal Analysis
                                </h3>
                                <p className="text-slate-500 mt-2">Map comprehensive contact points across all teeth.</p>
                            </div>

                            {/* Grid Matrix Layout exactly matching reference image */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto p-4 md:p-8">
                                    <div className="min-w-[700px] flex flex-col space-y-12">
                                        {OCCLUSAL_CATEGORIES.map((category) => (
                                            <div key={category.id} className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                                                {/* Category Label */}
                                                <div className="w-full md:w-56 shrink-0">
                                                    <span className="text-lg text-slate-800 font-medium">{category.label}</span>
                                                </div>

                                                {/* Buttons Matrix for this category */}
                                                <div className="flex-1 flex flex-col gap-5">
                                                    {/* Maxillary Row */}
                                                    <div className="flex items-center gap-10 justify-start">
                                                        {/* Q1 (Right) */}
                                                        <div className="flex gap-2">
                                                            {Q1.map(id => {
                                                                const isSelected = occlusalData[category.id].includes(id);
                                                                return (
                                                                    <button
                                                                        key={id}
                                                                        onClick={() => handleOcclusalToggle(category.id, id)}
                                                                        className={cn(
                                                                            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all duration-200 ring-offset-1 focus:outline-none focus:ring-2 focus:ring-slate-300",
                                                                            isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-sm transform scale-[1.05]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                                        )}
                                                                    >
                                                                        {id}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                        {/* Q2 (Left) */}
                                                        <div className="flex gap-2">
                                                            {Q2.map(id => {
                                                                const isSelected = occlusalData[category.id].includes(id);
                                                                return (
                                                                    <button
                                                                        key={id}
                                                                        onClick={() => handleOcclusalToggle(category.id, id)}
                                                                        className={cn(
                                                                            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all duration-200 ring-offset-1 focus:outline-none focus:ring-2 focus:ring-slate-300",
                                                                            isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-sm transform scale-[1.05]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                                        )}
                                                                    >
                                                                        {id}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Mandibular Row */}
                                                    <div className="flex items-center gap-10 justify-start">
                                                        {/* Q4 (Right) */}
                                                        <div className="flex gap-2">
                                                            {Q4.map(id => {
                                                                const isSelected = occlusalData[category.id].includes(id);
                                                                return (
                                                                    <button
                                                                        key={id}
                                                                        onClick={() => handleOcclusalToggle(category.id, id)}
                                                                        className={cn(
                                                                            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all duration-200 ring-offset-1 focus:outline-none focus:ring-2 focus:ring-slate-300",
                                                                            isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-sm transform scale-[1.05]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                                        )}
                                                                    >
                                                                        {id}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                        {/* Q3 (Left) */}
                                                        <div className="flex gap-2">
                                                            {Q3.map(id => {
                                                                const isSelected = occlusalData[category.id].includes(id);
                                                                return (
                                                                    <button
                                                                        key={id}
                                                                        onClick={() => handleOcclusalToggle(category.id, id)}
                                                                        className={cn(
                                                                            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all duration-200 ring-offset-1 focus:outline-none focus:ring-2 focus:ring-slate-300",
                                                                            isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-sm transform scale-[1.05]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                                        )}
                                                                    >
                                                                        {id}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>



            </div>
        </div>
    );
}
