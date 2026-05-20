import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import symmetryImg from '../assets/facial/symmetry.png';
import asymmetryImg from '../assets/facial/asymmetry.png';
import verticalImg from '../assets/facial/vertical.png';
import horizontalImg from '../assets/facial/horizontal.png';
import mixtureImg from '../assets/facial/mixture.png';

interface FacialSymmetryProps {
    value: string;
    onChange: (val: string) => void;
}

export const FacialSymmetry: React.FC<FacialSymmetryProps> = ({ value, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-bold text-slate-700">Facial symmetry</h3>
                <p className="text-xs text-slate-500 mb-3">Select the finding...</p>
                
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'symmetry', label: 'Symmetry', sub: 'หน้าสมมาตร', img: symmetryImg },
                        { id: 'asymmetry', label: 'Asymmetry', sub: 'หน้าไม่สมมาตร', img: asymmetryImg }
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
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#1D9E75] text-white rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                )}
                                <div className="h-40 sm:h-48 w-full relative flex items-center justify-center overflow-hidden mb-2">
                                    <img src={opt.img} alt={opt.label} className="w-full h-full object-contain" />
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

            <div className="bg-slate-50 border border-slate-200 rounded-[10px] p-3">
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-3">
                    ASYMMETRY TYPES — REFERENCE
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'Vertical', sub: 'แนวนอนเบี้ยว', img: verticalImg },
                        { label: 'Horizontal', sub: 'แนวตั้งเบี้ยว', img: horizontalImg },
                        { label: 'Mixture', sub: 'ทั้งสองแนว', img: mixtureImg },
                    ].map((ref, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center gap-1 select-none bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                            <div className="h-28 w-full relative flex items-center justify-center overflow-hidden mb-2">
                                <img src={ref.img} alt={ref.label} className="w-full h-full object-contain" />
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] font-medium text-slate-500">{ref.label}</div>
                                <div className="text-[9px] text-slate-400">{ref.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
