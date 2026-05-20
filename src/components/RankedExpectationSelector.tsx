import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface RankedExpectationSelectorProps {
    selectedExpectations: string[];
    onSelectionsChange: (selections: string[]) => void;
    otherValue: string;
    onOtherChange: (value: string) => void;
}

const OPTIONS = [
    { id: 'Chewing', label: 'Chewing', th: 'การบดเคี้ยวอาหาร' },
    { id: 'Esthetic', label: 'Esthetic', th: 'ความสวยงาม' },
    { id: 'Health', label: 'Health', th: 'การรักษาสุขภาพฟันและอวัยวะ' },
    { id: 'Phonetics', label: 'Phonetics', th: 'การออกเสียง' },
    { id: 'Others', label: 'Others...', th: 'อื่นๆ' },
];

export const RankedExpectationSelector: React.FC<RankedExpectationSelectorProps> = ({
    selectedExpectations,
    onSelectionsChange,
    otherValue,
    onOtherChange,
}) => {
    // Helper to get current rank of an option (1-based)
    const getRankNumber = (id: string): number | null => {
        const index = selectedExpectations.indexOf(id);
        return index !== -1 ? index + 1 : null;
    };

    const handleCardClick = (id: string) => {
        const index = selectedExpectations.indexOf(id);
        if (index !== -1) {
            // Deselect and re-order remaining
            const newSelections = [...selectedExpectations];
            newSelections.splice(index, 1);
            onSelectionsChange(newSelections);
            if (id === 'Others') {
                onOtherChange('');
            }
        } else {
            // Append to the end, getting the next available rank
            onSelectionsChange([...selectedExpectations, id]);
        }
    };

    const handleReset = () => {
        onSelectionsChange([]);
        onOtherChange('');
    };

    // Width calculation based on priority (index 0 is longest)
    const getBarWidth = (rankNumber: number) => {
        const totalSelected = selectedExpectations.length;
        if (totalSelected === 1) return '100%';
        // Create an even distribution
        // rank 1 gets 100%, last rank gets 20%
        const percentage = 100 - ((rankNumber - 1) * (80 / (totalSelected - 1)));
        return `${Math.max(percentage, 20)}%`;
    };

    const isOthersSelected = selectedExpectations.includes('Others');

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-3">
                    <Label className="text-sm font-bold text-slate-700">Patient Expectations (Tap in order of priority)</Label>
                    {selectedExpectations.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            onClick={handleReset}
                        >
                            <RefreshCcw className="w-3.5 h-3.5 mr-1" />
                            Reset
                        </Button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {OPTIONS.map(opt => {
                        const rankNumber = getRankNumber(opt.id);
                        const isSelected = rankNumber !== null;
                        
                        return (
                            <div
                                key={opt.id}
                                onClick={() => handleCardClick(opt.id)}
                                className={cn(
                                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1 min-h-[5rem]",
                                    isSelected
                                        ? "border-teal-500 bg-teal-50 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                {/* Rank Badge */}
                                {isSelected && (
                                    <div className="absolute -top-3 -left-3 w-7 h-7 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white">
                                        {rankNumber}
                                    </div>
                                )}
                                
                                <span className={cn("font-bold text-sm", isSelected ? "text-teal-900" : "text-slate-700")}>
                                    {opt.label}
                                </span>
                                <span className={cn("text-xs", isSelected ? "text-teal-600" : "text-slate-400")}>
                                    {opt.th}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {isOthersSelected && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Input
                            value={otherValue}
                            onChange={e => onOtherChange(e.target.value)}
                            className="focus-visible:ring-teal-500"
                            placeholder="Please specify other expectations..."
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Selected Priority List */}
            {selectedExpectations.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <Label className="text-xs font-bold text-slate-500 mb-3 block uppercase tracking-wider">Priority Ranking</Label>
                    <div className="space-y-3">
                        {selectedExpectations.map((id, index) => {
                            const option = OPTIONS.find(o => o.id === id);
                            const label = option ? option.label : id;
                            const rankNumber = index + 1;
                            
                            return (
                                <div key={id} className="group relative">
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                                            {rankNumber}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700">{label}</span>
                                            {id === 'Others' && otherValue && (
                                                <span className="text-xs text-slate-500 truncate mt-0.5">{otherValue}</span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Priority Bar Indicator */}
                                    <div className="absolute top-0 left-4 h-full bg-teal-50 rounded bg-opacity-70 z-0 transition-all duration-300" style={{ width: getBarWidth(rankNumber) }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
