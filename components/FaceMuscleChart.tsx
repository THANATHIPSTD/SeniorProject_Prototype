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
  { id: 'lat-pterygoid-R', src: '/face-svgs/l-lateral.png', left: '17.382%', top: '43.520%', width: '10.435%', height: '5.583%' },
  { id: 'masseter-R', src: '/face-svgs/l-masseter.png', left: '17.494%', top: '48.708%', width: '11.941%', height: '21.291%' },
  { id: 'med-pterygoid-R', src: '/face-svgs/l-medial.png', left: '29.854%', top: '65.166%', width: '8.091%', height: '8.291%' },

  // Screen Right (Patient Left)
  { id: 'temporalis-L', src: '/face-svgs/r-temporalis.svg', left: '74.442%', top: '16.416%', width: '11.495%', height: '26.666%' },
  { id: 'lat-pterygoid-L', src: '/face-svgs/r-lateral.png', left: '72.265%', top: '43.541%', width: '10.435%', height: '5.583%' },
  { id: 'masseter-L', src: '/face-svgs/r-masseter.png', left: '70.758%', top: '48.708%', width: '11.941%', height: '21.291%' },
  { id: 'med-pterygoid-L', src: '/face-svgs/r-medial.png', left: '62.109%', top: '65.166%', width: '8.091%', height: '8.291%' },
];

const MUSCLE_LIST = [
    { id: 'masseter', label: 'Masseter' },
    { id: 'temporalis', label: 'Temporalis' },
    { id: 'lat-pterygoid', label: 'Lateral Pterygoid' },
    { id: 'med-pterygoid', label: 'Medial Pterygoid' }
];

export function FaceMuscleChart({ selectedMuscles, onToggleMuscle }: FaceMuscleChartProps) {
    const isSelected = (id: string) => selectedMuscles.includes(id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Visualization */}
            <div className="w-full max-w-md mx-auto relative bg-slate-50/50 rounded-3xl border border-slate-100 p-4">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1792/2400' }}>
                    {/* Base Face Image */}
                    <img 
                        src="/face-svgs/Image pure.svg" 
                        alt="Face Base" 
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Interactive Muscle Overlays */}
                    {MUSCLE_AREAS.map((muscle) => {
                        const active = isSelected(muscle.id);
                        return (
                            <button
                                key={muscle.id}
                                type="button"
                                onClick={() => onToggleMuscle(muscle.id)}
                                className="absolute z-10 cursor-pointer group"
                                style={{
                                    left: muscle.left,
                                    top: muscle.top,
                                    width: muscle.width,
                                    height: muscle.height
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
                                        className="w-full h-full bg-red-500"
                                        style={active ? {
                                            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0.3) 85%)',
                                            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0.3) 85%)'
                                        } : {}}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: Controls */}
            <div className="space-y-4 pt-4 lg:pt-0">
                <div className="flex justify-between items-end">
                    <Label className="text-sm font-bold text-slate-700">Muscle Pain <span className="text-slate-400 font-normal ml-1">(Select or click on image)</span></Label>
                    <div className="flex gap-4 text-xs font-bold text-slate-400 mr-4">
                        <span className="w-12 text-center">Right</span>
                        <span className="w-12 text-center">Left</span>
                    </div>
                </div>

                <div className="space-y-2">
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
                
                <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600 flex gap-3">
                    <div className="mt-0.5 shrink-0 text-blue-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p>You can select muscle pain by either clicking the R/L buttons or by directly interacting with the anatomical chart on the left.</p>
                </div>
            </div>
        </div>
    );
}
