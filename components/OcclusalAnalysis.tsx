'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Types & Constants ---

type ContactType = 'premature' | 'mip' | 'protrusive' | 'working' | 'nonWorking';

const TOOTH_COLORS = [
  "#14b8a6", "#f43f5e", "#8b5cf6", "#f59e0b", "#3b82f6", 
  "#ec4899", "#10b981", "#a855f7", "#ef4444", "#0ea5e9", 
  "#84cc16", "#f97316", "#6366f1"
];
const getToothColor = (id: number) => TOOTH_COLORS[id % TOOTH_COLORS.length];

interface Pair {
  upper: number;
  lower: number;
}

const CONTACT_SECTIONS: { id: ContactType; label: string; fullLabel: string }[] = [
  { id: 'premature', label: 'Premature contact', fullLabel: 'Premature contact' },
  { id: 'mip', label: 'MIP contact', fullLabel: 'Maximum Intercuspation' },
  { id: 'protrusive', label: 'Protrusive contact', fullLabel: 'Protrusive contact' },
  { id: 'working', label: 'Working side contact', fullLabel: 'Working side contact' },
  { id: 'nonWorking', label: 'Non-working side contact', fullLabel: 'Non-working side contact' },
];

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// --- Mock API ---
const MOCK_EXPLANATIONS: Record<ContactType, string> = {
  premature: "An occlusal contact that occurs before the other teeth reach maximum intercuspation. It can lead to tooth mobility or TMJ issues.",
  mip: "The complete intercuspation of the opposing teeth independent of condylar position. This is the 'habitual' bite.",
  protrusive: "Contacts that occur when the mandible moves forward from MIP. Ideally, only anterior teeth stroke kontakt.",
  working: "The side toward which the mandible moves during lateral excursion. Multiple teeth usually contact here in group function.",
  nonWorking: "The side away from which the mandible moves. Contacts here are often considered interferences that can cause trauma.",
};

const ToothIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3h10a2 2 0 0 1 2 2v3a6 6 0 0 1-4 5.66v5.84a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-1.74-1L12 18l-1.26 3a2.5 2.5 0 0 1-1.74 1A2.5 2.5 0 0 1 6.5 19.5v-5.84A6 6 0 0 1 2.5 8V5a2 2 0 0 1 2-2z" />
  </svg>
);

// --- Component ---

export default function OcclusalAnalysis() {
  // State for pairs per section
  const [sectionPairs, setSectionPairs] = useState<Record<ContactType, Pair[]>>({
    premature: [],
    mip: [],
    protrusive: [],
    working: [],
    nonWorking: [],
  });

  // State for current selection in a specific section
  const [activeSelection, setActiveSelection] = useState<{ sectionId: ContactType; id: number; jaw: 'upper' | 'lower' } | null>(null);

  // State for AI Tooltips
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingHelp, setLoadingHelp] = useState<Set<string>>(new Set());

  // Additional Measurements State
  const [angleClass, setAngleClass] = useState({ right: 'Class I', left: 'Class I' });
  const [overlaps, setOverlaps] = useState({ horizontal: '', vertical: '' });
  const [crmip, setCrmip] = useState({ anteriorSlide: '', lateralDir: 'Right', lateralSlide: '' });

  // Refs for Line Drawing
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const toothRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lineCoords, setLineCoords] = useState<Record<ContactType, { x1: number; y1: number; x2: number; y2: number; upperId: number; lowerId: number }[]>>({
    premature: [], mip: [], protrusive: [], working: [], nonWorking: []
  });

  // --- Handlers ---

  const handleHelpClick = async (type: ContactType) => {
    if (explanations[type]) return;
    
    setLoadingHelp(prev => new Set(prev).add(type));
    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setExplanations(prev => ({ ...prev, [type]: MOCK_EXPLANATIONS[type] }));
    setLoadingHelp(prev => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  const onToothClick = (sectionId: ContactType, id: number, jaw: 'upper' | 'lower') => {
    // If nothing selected or selecting same jaw again, just update selection
    if (!activeSelection || activeSelection.sectionId !== sectionId || activeSelection.jaw === jaw) {
      setActiveSelection({ sectionId, id, jaw });
      return;
    }

    // Creating a pair
    const upper = jaw === 'upper' ? id : activeSelection.id;
    const lower = jaw === 'lower' ? id : activeSelection.id;

    // Check if pair already exists in this section
    const exists = sectionPairs[sectionId].find(p => p.upper === upper && p.lower === lower);
    if (!exists) {
      setSectionPairs(prev => ({
        ...prev,
        [sectionId]: [...prev[sectionId], { upper, lower }]
      }));
    }

    setActiveSelection(null);
  };

  const removePair = (sectionId: ContactType, pair: Pair) => {
    setSectionPairs(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].filter(p => !(p.upper === pair.upper && p.lower === pair.lower))
    }));
  };

  // --- Visuals: Calculate Line Coords ---
  const updateLines = useCallback(() => {
    const newCoords: Record<string, {x1: number; y1: number; x2: number; y2: number; upperId: number; lowerId: number}[]> = {};
    
    CONTACT_SECTIONS.forEach(sec => {
      const pairs = sectionPairs[sec.id];
      const sectionCoords = pairs.map(p => {
        const upperEl = toothRefs.current[`${sec.id}-${p.upper}`];
        const lowerEl = toothRefs.current[`${sec.id}-${p.lower}`];
        const containerEl = containerRefs.current[sec.id];

        if (upperEl && lowerEl && containerEl) {
          const uRect = upperEl.getBoundingClientRect();
          const lRect = lowerEl.getBoundingClientRect();
          const cRect = containerEl.getBoundingClientRect();

          return {
            x1: uRect.left + uRect.width / 2 - cRect.left,
            y1: uRect.top + uRect.height / 2 - cRect.top,
            x2: lRect.left + lRect.width / 2 - cRect.left,
            y2: lRect.top + lRect.height / 2 - cRect.top,
            upperId: p.upper,
            lowerId: p.lower,
          };
        }
        return null;
      }).filter((c): c is { x1: number; y1: number; x2: number; y2: number; upperId: number; lowerId: number } => Boolean(c));
      
      newCoords[sec.id] = sectionCoords;
    });

    setLineCoords(newCoords);
  }, [sectionPairs]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [updateLines]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
      
      {/* Intro */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Occlusal Analysis</h1>
          <p className="text-slate-500">Mapping tooth contacts during jaw relationships and eccentric movements.</p>
        </div>
        <button
          onClick={() => setSectionPairs({ premature: [], mip: [], protrusive: [], working: [], nonWorking: [] })}
          className="h-10 px-4 rounded-xl text-sm font-bold border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm"
        >
          Clear All Analysis
        </button>
      </div>

      <TooltipProvider>
        {CONTACT_SECTIONS.map((section) => (
          <div 
            key={section.id} 
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8 relative"
            ref={el => { containerRefs.current[section.id] = el }}
          >
            {/* SVG Line Overlay */}
            <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible" width="100%" height="100%">
              {lineCoords[section.id]?.map((line, i) => (
                <line 
                  key={i} 
                  x1={line.x1} y1={line.y1} 
                  x2={line.x2} y2={line.y2} 
                  stroke={getToothColor(line.upperId)} 
                  strokeWidth="2.5" 
                  strokeDasharray="5,3"
                  className="animate-in fade-in duration-300"
                />
              ))}
            </svg>

            {/* Section Header */}
            <div className="flex items-center justify-between relative z-10 w-full mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-800">{section.label}</h3>
                
                <Tooltip open={!!explanations[section.id] || loadingHelp.has(section.id)}>
                  <TooltipTrigger
                    onClick={() => handleHelpClick(section.id)}
                    className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    {loadingHelp.has(section.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <HelpCircle className="w-4 h-4" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs bg-slate-900 text-white border-none p-4 rounded-xl shadow-xl">
                    {explanations[section.id] || "Fetching explanation..."}
                  </TooltipContent>
                </Tooltip>
              </div>

              {sectionPairs[section.id].length > 0 && (
                <button
                  onClick={() => setSectionPairs(prev => ({ ...prev, [section.id]: [] }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  Clear connections
                </button>
              )}
            </div>

            {/* Tooth Interaction Area */}
            <div className="space-y-12 relative z-10">
              {/* Upper Jaw Row */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                  {UPPER_TEETH.map(id => {
                    const isSelected = activeSelection?.sectionId === section.id && activeSelection?.id === id && activeSelection?.jaw === 'upper';
                    const isPaired = sectionPairs[section.id].some(p => p.upper === id);
                    const color = getToothColor(id);
                    
                    return (
                      <button
                        key={id}
                        ref={el => { toothRefs.current[`${section.id}-${id}`] = el }}
                        onClick={() => onToothClick(section.id, id, 'upper')}
                        className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center text-base font-bold transition-all duration-200",
                          isSelected ? "text-white shadow-lg scale-110" : 
                          isPaired ? "bg-opacity-10" :
                          "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                        style={
                          isSelected ? { backgroundColor: color, borderColor: color } :
                          isPaired ? { backgroundColor: `${color}1A`, borderColor: `${color}80`, color: color } :
                          {}
                        }
                      >
                        {id}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Lower Jaw Row */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                  {LOWER_TEETH.map(id => {
                    const isSelected = activeSelection?.sectionId === section.id && activeSelection?.id === id && activeSelection?.jaw === 'lower';
                    const pairedUppers = sectionPairs[section.id].filter(p => p.lower === id).map(p => p.upper);
                    const isPaired = pairedUppers.length > 0;
                    const color = isPaired ? getToothColor(pairedUppers[0]) : getToothColor(id);

                    return (
                      <button
                        key={id}
                        ref={el => { toothRefs.current[`${section.id}-${id}`] = el }}
                        onClick={() => onToothClick(section.id, id, 'lower')}
                        className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center text-base font-bold transition-all duration-200",
                          isSelected ? "text-white shadow-lg scale-110" : 
                          isPaired ? "bg-opacity-10" :
                          "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                        style={
                          isSelected ? { backgroundColor: color, borderColor: color } :
                          isPaired ? { backgroundColor: `${color}1A`, borderColor: `${color}80`, color: color } :
                          {}
                        }
                      >
                        {id}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Pair Chips */}
            <div className="pt-4 border-t border-slate-100 relative z-10 flex flex-wrap gap-3">
              {sectionPairs[section.id].length === 0 ? (
                <p className="text-sm text-slate-400 italic">Select an upper and lower tooth to create a contact pair.</p>
              ) : (
                sectionPairs[section.id].map((pair, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-100 border border-slate-200 pl-3 pr-1 py-1 rounded-full group hover:bg-white hover:border-teal-200 transition-all">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700">{pair.upper}—{pair.lower}</span>
                    <button 
                      onClick={() => removePair(section.id, pair)}
                      className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </TooltipProvider>

      {/* --- Additional Clinical Fields --- */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white space-y-12">
        <div className="border-b border-slate-800 pb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Orthodontic & Occlusal Measurements
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Angle's Classification */}
          <div className="space-y-8">
            <h4 className="text-teal-400 text-sm font-bold uppercase tracking-widest">Angle's Classification</h4>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-slate-300">Right first molar</Label>
                <RadioGroup value={angleClass.right} onValueChange={(v: string) => setAngleClass(prev => ({...prev, right: v}))} className="flex gap-4">
                  {['Class I', 'Class II', 'Class III'].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                      <RadioGroupItem value={val} id={`r-${val}`} className="border-slate-500" />
                      <Label htmlFor={`r-${val}`} className="text-xs font-medium cursor-pointer">{val}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-4">
                <Label className="text-slate-300">Left first molar</Label>
                <RadioGroup value={angleClass.left} onValueChange={(v: string) => setAngleClass(prev => ({...prev, left: v}))} className="flex gap-4">
                  {['Class I', 'Class II', 'Class III'].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                      <RadioGroupItem value={val} id={`l-${val}`} className="border-slate-500" />
                      <Label htmlFor={`l-${val}`} className="text-xs font-medium cursor-pointer">{val}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Overlaps */}
          <div className="space-y-8">
            <h4 className="text-teal-400 text-sm font-bold uppercase tracking-widest">Overlap (mm)</h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-slate-300">Horizontal</Label>
                <Input type="number" value={overlaps.horizontal} onChange={e => setOverlaps(prev => ({...prev, horizontal: e.target.value}))} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-teal-500" placeholder="mm" />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-300">Vertical</Label>
                <Input type="number" value={overlaps.vertical} onChange={e => setOverlaps(prev => ({...prev, vertical: e.target.value}))} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-teal-500" placeholder="mm" />
              </div>
            </div>
          </div>

          {/* CR-MIP Discrepancy */}
          <div className="space-y-8 lg:col-span-2 border-t border-slate-800 pt-10">
            <h4 className="text-teal-400 text-sm font-bold uppercase tracking-widest">CR—MIP Discrepancy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Anterior slide</Label>
                    <span className="text-teal-400 font-mono text-xl bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">{crmip.anteriorSlide || "0.0"} <span className="text-xs text-slate-500">mm</span></span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.5"
                    value={crmip.anteriorSlide || 0}
                    onChange={e => setCrmip(prev => ({...prev, anteriorSlide: e.target.value}))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                  />
               </div>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Lateral slide</Label>
                    <span className="text-teal-400 font-mono text-xl bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">{crmip.lateralSlide || "0.0"} <span className="text-xs text-slate-500">mm</span></span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.5"
                    value={crmip.lateralSlide || 0}
                    onChange={e => setCrmip(prev => ({...prev, lateralSlide: e.target.value}))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                  />
                  <div className="pt-2">
                    <RadioGroup value={crmip.lateralDir} onValueChange={(v: string) => setCrmip(prev => ({...prev, lateralDir: v}))} className="flex gap-2 bg-slate-800 p-1.5 rounded-xl w-full">
                      {['Right', 'Left'].map(dir => (
                        <div key={dir} className={cn(
                          "flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all",
                          crmip.lateralDir === dir ? "bg-teal-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                        )} onClick={() => setCrmip(prev => ({...prev, lateralDir: dir}))}>
                           {dir}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
