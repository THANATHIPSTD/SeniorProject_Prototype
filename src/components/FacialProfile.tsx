import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import convexImg from '../assets/facial/profile_convex.png';
import straightImg from '../assets/facial/profile_stright.png';
import concaveImg from '../assets/facial/profile_concave.png';

interface FacialProfileProps {
    value: string;
    onChange: (val: string) => void;
}

export const FacialProfile: React.FC<FacialProfileProps> = ({ value, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-bold text-slate-700">Facial Profile</h3>
                <p className="text-xs text-slate-500 mb-3">Select the finding...</p>
                
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'straight', label: 'Straight', sub: 'ตรง', img: straightImg },
                        { id: 'convex', label: 'Convex', sub: 'นูน', img: convexImg },
                        { id: 'concave', label: 'Concave', sub: 'เว้า', img: concaveImg }
                    ].map(opt => {
                        const isSelected = value === opt.id;
                        return (
                            <div
                                key={opt.id}
                                onClick={() => onChange(opt.id)}
                                className={cn(
                                    "relative p-4 rounded-xl border-[1.5px] cursor-pointer transition-all flex flex-col items-center justify-center gap-2 select-none",
                                    isSelected
                                        ? "border-[#1D9E75] bg-[#f0faf6] shadow-sm"
                                        : "border-gray-200 bg-white hover:border-[#1D9E75]"
                                )}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#1D9E75] text-white rounded-full flex items-center justify-center z-10">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                )}
                                <div className="h-40 sm:h-48 w-full relative flex items-center justify-center overflow-hidden mb-2">
                                    <img src={`${opt.img}?v=2`} alt={opt.label} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-slate-800">{opt.label}</div>
                                    <div className="text-[11px] text-slate-500">{opt.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
