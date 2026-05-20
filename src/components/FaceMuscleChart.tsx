import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export interface FaceMuscleChartProps {
    selectedMuscles: string[];
    onToggleMuscle: (muscleId: string) => void;
}

const MUSCLE_AREAS = [
  // Screen Left (Patient Right)
  { id: 'temporalis-R', src: '/face-svgs/l-temporalis.svg', left: '13.699%', top: '16.416%', width: '11.495%', height: '26.666%' },
  { id: 'masseter-R', src: '/face-svgs/l-masseter.png', left: '17.494%', top: '48.708%', width: '11.941%', height: '21.291%' },

  // Screen Right (Patient Left)
  { id: 'temporalis-L', src: '/face-svgs/r-temporalis.svg', left: '74.442%', top: '16.416%', width: '11.495%', height: '26.666%' },
  { id: 'masseter-L', src: '/face-svgs/r-masseter.png', left: '70.758%', top: '48.708%', width: '11.941%', height: '21.291%' },
];

const MUSCLE_LIST = [
    { id: 'masseter', label: 'Masseter' },
    { id: 'temporalis', label: 'Temporalis' },
    { id: 'lat-pterygoid', label: 'Lateral Pterygoid' },
    { id: 'med-pterygoid', label: 'Medial Pterygoid' }
];

const SIDEVIEW_MUSCLE_AREAS = [
  { id: 'temporalis', src: '/face-svgs/Temporalis Sideview.svg', left: '19.604%', top: '20.435%', width: '43.750%', height: '30.029%' },
  { id: 'lat-pterygoid', src: '/face-svgs/Lateral Pterygoid Sideview.svg', left: '38.867%', top: '48.413%', width: '20.557%', height: '17.334%' },
  { id: 'med-pterygoid', src: '/face-svgs/Medial Pterygoid Sideview.svg', left: '42.847%', top: '56.641%', width: '15.967%', height: '22.266%' }
];

const formatMuscleName = (id: string) => {
    const baseId = id.replace('-R', '').replace('-L', '');
    const names: Record<string, string> = {
        'temporalis': 'Temporalis',
        'masseter': 'Masseter',
        'lat-pterygoid': 'Lateral Pterygoid',
        'med-pterygoid': 'Medial Pterygoid'
    };
    return names[baseId] || baseId;
};

const TooltipLabel = ({ text, flipped = false }: { text: string, flipped?: boolean }) => (
    <div className={cn(
        "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg",
        flipped && "-scale-x-100"
    )}>
        {text}
    </div>
);

export function FaceMuscleChart({ selectedMuscles, onToggleMuscle }: FaceMuscleChartProps) {
    const isSelected = (id: string) => selectedMuscles.includes(id);

    return (
        <div className="flex flex-col gap-6">
            {/* Visualizations Panel (Top) */}
            <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-4 sm:p-6 flex flex-col w-full max-w-5xl mx-auto">
                <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full items-center">
                    {/* Right Side View (Flipped) */}
                    <div className="w-full flex flex-col">
                        <div className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Right Side</div>
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100" style={{ aspectRatio: '1/1' }}>
                            <div className="absolute inset-0 w-full h-full -scale-x-100">
                                <img 
                                    src="/face-svgs/Sideview pure.png" 
                                    alt="Face Right Side" 
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                />
                                {SIDEVIEW_MUSCLE_AREAS.map((muscle) => {
                                    const activeId = `${muscle.id}-R`;
                                    const active = isSelected(activeId);
                                    return (
                                        <button
                                            key={activeId}
                                            type="button"
                                            onClick={() => onToggleMuscle(activeId)}
                                            className="absolute z-10 cursor-pointer group transition-all duration-300"
                                            style={{
                                                left: muscle.left,
                                                top: muscle.top,
                                                width: muscle.width,
                                                height: muscle.height,
                                                filter: active ? 'drop-shadow(0 0 4px rgba(239,68,68,0.8)) drop-shadow(0 0 12px rgba(220,38,38,0.4))' : 'none'
                                            }}
                                            title={`Right ${muscle.id}`}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute inset-0 w-full h-full pointer-events-none transition-all duration-500",
                                                    active ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                                                )}
                                                style={{
                                                    WebkitMaskImage: `url('${muscle.src}')`,
                                                    WebkitMaskSize: 'contain',
                                                    WebkitMaskRepeat: 'no-repeat',
                                                    WebkitMaskPosition: 'center',
                                                    maskImage: `url('${muscle.src}')`,
                                                    maskSize: 'contain',
                                                    maskRepeat: 'no-repeat',
                                                    maskPosition: 'center'
                                                }}
                                            >
                                                <div 
                                                    className={cn("w-full h-full", !active && "bg-red-500")}
                                                    style={active ? {
                                                        background: 'radial-gradient(ellipse at center, rgba(254,226,226,0.9) 0%, rgba(239,68,68,0.9) 35%, rgba(185,28,28,0.85) 70%, rgba(127,29,29,0.8) 100%)'
                                                    } : {}}
                                                />
                                            </div>
                                            <TooltipLabel text={`${formatMuscleName(activeId)} (Right)`} flipped />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Front View */}
                    <div className="w-full flex flex-col">
                        <div className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Front View</div>
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100" style={{ aspectRatio: '1792/2400' }}>
                            <img 
                                src="/face-svgs/Image pure.svg" 
                                alt="Face Base" 
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                            {MUSCLE_AREAS.map((muscle) => {
                                const active = isSelected(muscle.id);
                                const sideText = muscle.id.endsWith('-R') ? ' (Right)' : ' (Left)';
                                return (
                                    <button
                                        key={muscle.id}
                                        type="button"
                                        onClick={() => onToggleMuscle(muscle.id)}
                                        className="absolute z-10 cursor-pointer group transition-all duration-300"
                                        style={{
                                            left: muscle.left,
                                            top: muscle.top,
                                            width: muscle.width,
                                            height: muscle.height,
                                            filter: active ? 'drop-shadow(0 0 4px rgba(239,68,68,0.8)) drop-shadow(0 0 12px rgba(220,38,38,0.4))' : 'none'
                                        }}
                                        title={muscle.id}
                                    >
                                        <div
                                            className={cn(
                                                "absolute inset-0 w-full h-full pointer-events-none transition-all duration-500",
                                                active ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                                            )}
                                            style={{
                                                WebkitMaskImage: `url('${muscle.src}')`,
                                                WebkitMaskSize: 'contain',
                                                WebkitMaskRepeat: 'no-repeat',
                                                WebkitMaskPosition: 'center',
                                                maskImage: `url('${muscle.src}')`,
                                                maskSize: 'contain',
                                                maskRepeat: 'no-repeat',
                                                maskPosition: 'center'
                                            }}
                                        >
                                            <div 
                                                className={cn("w-full h-full", !active && "bg-red-500")}
                                                style={active ? {
                                                    background: 'radial-gradient(ellipse at center, rgba(254,226,226,0.9) 0%, rgba(239,68,68,0.9) 35%, rgba(185,28,28,0.85) 70%, rgba(127,29,29,0.8) 100%)'
                                                } : {}}
                                            />
                                        </div>
                                        <TooltipLabel text={`${formatMuscleName(muscle.id)}${sideText}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Left Side View */}
                    <div className="w-full flex flex-col">
                        <div className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Left Side</div>
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100" style={{ aspectRatio: '1/1' }}>
                            <div className="absolute inset-0 w-full h-full">
                                <img 
                                    src="/face-svgs/Sideview pure.png" 
                                    alt="Face Left Side" 
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                />
                                {SIDEVIEW_MUSCLE_AREAS.map((muscle) => {
                                    const activeId = `${muscle.id}-L`;
                                    const active = isSelected(activeId);
                                    return (
                                        <button
                                            key={activeId}
                                            type="button"
                                            onClick={() => onToggleMuscle(activeId)}
                                            className="absolute z-10 cursor-pointer group transition-all duration-300"
                                            style={{
                                                left: muscle.left,
                                                top: muscle.top,
                                                width: muscle.width,
                                                height: muscle.height,
                                                filter: active ? 'drop-shadow(0 0 4px rgba(239,68,68,0.8)) drop-shadow(0 0 12px rgba(220,38,38,0.4))' : 'none'
                                            }}
                                            title={`Left ${muscle.id}`}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute inset-0 w-full h-full pointer-events-none transition-all duration-500",
                                                    active ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                                                )}
                                                style={{
                                                    WebkitMaskImage: `url('${muscle.src}')`,
                                                    WebkitMaskSize: 'contain',
                                                    WebkitMaskRepeat: 'no-repeat',
                                                    WebkitMaskPosition: 'center',
                                                    maskImage: `url('${muscle.src}')`,
                                                    maskSize: 'contain',
                                                    maskRepeat: 'no-repeat',
                                                    maskPosition: 'center'
                                                }}
                                            >
                                                <div 
                                                    className={cn("w-full h-full", !active && "bg-red-500")}
                                                    style={active ? {
                                                        background: 'radial-gradient(ellipse at center, rgba(254,226,226,0.9) 0%, rgba(239,68,68,0.9) 35%, rgba(185,28,28,0.85) 70%, rgba(127,29,29,0.8) 100%)'
                                                    } : {}}
                                                />
                                            </div>
                                            <TooltipLabel text={`${formatMuscleName(activeId)} (Left)`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Panel (Bottom) */}
            <div className="w-full max-w-5xl mx-auto space-y-4">
                <div className="flex justify-between items-end mb-4 px-2">
                    <Label className="text-sm font-bold text-slate-700">Muscle Pain <span className="text-slate-400 font-normal ml-1 text-xs">Select or click on images</span></Label>
                    <div className="flex gap-4 text-xs font-bold text-slate-400 mr-4">
                        <span className="w-12 text-center">Right</span>
                        <span className="w-12 text-center">Left</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MUSCLE_LIST.map(muscle => (
                        <div key={muscle.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                            <span className="font-medium text-slate-700 text-sm">{muscle.label}</span>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => onToggleMuscle(`${muscle.id}-R`)}
                                    className={cn("w-12 h-10 rounded-lg border-2 font-bold text-sm transition-all flex items-center justify-center", selectedMuscles.includes(`${muscle.id}-R`) ? "bg-rose-50 border-rose-500 text-rose-700" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300")}
                                >R</button>
                                <button
                                    type="button"
                                    onClick={() => onToggleMuscle(`${muscle.id}-L`)}
                                    className={cn("w-12 h-10 rounded-lg border-2 font-bold text-sm transition-all flex items-center justify-center", selectedMuscles.includes(`${muscle.id}-L`) ? "bg-rose-50 border-rose-500 text-rose-700" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300")}
                                >L</button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-sm text-slate-600 flex gap-3">
                    <div className="mt-0.5 shrink-0 text-teal-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-xs leading-relaxed">You can select muscle pain by either clicking the R/L buttons or by directly interacting with the anatomical charts above.</p>
                </div>
            </div>
        </div>
    );
}
