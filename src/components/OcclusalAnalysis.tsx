
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, X, Loader2, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleButtonGroup } from '@/components/ui/ToggleButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Types & Constants ---
type ContactType = 'mip' | 'premature' | 'protrusive' | 'working' | 'nonWorking';

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
  { id: 'mip', label: 'MIP contact', fullLabel: 'Maximum Intercuspation' },
  { id: 'premature', label: 'Premature contact', fullLabel: 'Premature contact' },
  { id: 'protrusive', label: 'Protrusive contact', fullLabel: 'Protrusive contact' },
  { id: 'working', label: 'Right lateral excursion', fullLabel: 'Right lateral excursion' },
  { id: 'nonWorking', label: 'Left lateral excursion', fullLabel: 'Left lateral excursion' },
];

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const MOCK_EXPLANATIONS: Record<ContactType, string> = {
  premature: "An occlusal contact that occurs before the other teeth reach maximum intercuspation. It can lead to tooth mobility or TMJ issues.",
  mip: "The complete intercuspation of the opposing teeth independent of condylar position. This is the 'habitual' bite.",
  protrusive: "Contacts that occur when the mandible moves forward from MIP. Ideally, only anterior teeth stroke kontakt.",
  working: "The side toward which the mandible moves during lateral excursion. Multiple teeth usually contact here in group function.",
  nonWorking: "The side away from which the mandible moves. Contacts here are often considered interferences that can cause trauma.",
};

// --- Component ---
export default function OcclusalAnalysis() {
  const [activeTab, setActiveTab] = useState<ContactType>('mip');

  const [sectionPairs, setSectionPairs] = useState<Record<ContactType, Pair[]>>({
    premature: [], mip: [], protrusive: [], working: [], nonWorking: [],
  });

  const [activeSelection, setActiveSelection] = useState<{ id: number; jaw: 'upper' | 'lower' } | null>(null);
  const [hoveredPair, setHoveredPair] = useState<Pair | null>(null);

  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingHelp, setLoadingHelp] = useState<Set<string>>(new Set());

  // Additional Measurements State
  const [angleClass, setAngleClass] = useState({ molarRight: 'Class I', molarLeft: 'Class I', canineRight: 'Class I', canineLeft: 'Class I' });
  const [overlaps, setOverlaps] = useState({ horizontal: '', vertical: '' });
  const [crmip, setCrmip] = useState({ anteriorSlide: '', lateralDir: 'Right', lateralSlide: '' });

  // Refs for Line Drawing
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toothRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [lineCoords, setLineCoords] = useState<{ x1: number; y1: number; x2: number; y2: number; upperId: number; lowerId: number }[]>([]);

  // --- Handlers ---
  const handleHelpClick = async (type: ContactType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (explanations[type]) return;

    setLoadingHelp(prev => new Set(prev).add(type));
    await new Promise(resolve => setTimeout(resolve, 800));
    setExplanations(prev => ({ ...prev, [type]: MOCK_EXPLANATIONS[type] }));

    setLoadingHelp(prev => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  const handleTabChange = (tabId: ContactType) => {
    setActiveTab(tabId);
    setActiveSelection(null);
    setHoveredPair(null);
  };

  const onToothClick = (id: number, jaw: 'upper' | 'lower') => {
    if (!activeSelection || activeSelection.jaw === jaw) {
      setActiveSelection({ id, jaw });
      return;
    }

    const upper = jaw === 'upper' ? id : activeSelection.id;
    const lower = jaw === 'lower' ? id : activeSelection.id;

    const exists = sectionPairs[activeTab].find(p => p.upper === upper && p.lower === lower);
    if (!exists) {
      setSectionPairs(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { upper, lower }]
      }));
    }

    setActiveSelection(null);
  };

  const removePair = (pair: Pair) => {
    setSectionPairs(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(p => !(p.upper === pair.upper && p.lower === pair.lower))
    }));
    if (hoveredPair?.upper === pair.upper && hoveredPair?.lower === pair.lower) {
      setHoveredPair(null);
    }
  };

  const checkInterference = (tab: string, upper: number, lower: number) => {
    const isLeft = (upper >= 21 && upper <= 28) || (lower >= 31 && lower <= 38);
    const isRight = (upper >= 11 && upper <= 18) || (lower >= 41 && lower <= 48);

    if (tab === 'working') {
      return isLeft;
    }
    if (tab === 'nonWorking') {
      return isRight;
    }
    return false;
  };

  // --- Visuals: Calculate Line Coords for Active Tab ---
  const updateLines = useCallback(() => {
    const pairs = sectionPairs[activeTab];
    const containerEl = containerRef.current;

    if (!containerEl) return;

    const coords = pairs.map(p => {
      const upperEl = toothRefs.current[p.upper];
      const lowerEl = toothRefs.current[p.lower];

      if (upperEl && lowerEl) {
        const uRect = upperEl.getBoundingClientRect();
        const lRect = lowerEl.getBoundingClientRect();
        const cRect = containerEl.getBoundingClientRect();

        // คำนวณตำแหน่งโดยอิงจากคอนเทนเนอร์ที่เลื่อนได้ (Scrollable container)
        return {
          x1: uRect.left + uRect.width / 2 - cRect.left,
          y1: uRect.top + uRect.height / 2 - cRect.top + 16, // ขยับจุดยึดลงมาที่ขอบล่างปุ่มบน
          x2: lRect.left + lRect.width / 2 - cRect.left,
          y2: lRect.top + lRect.height / 2 - cRect.top - 16, // ขยับจุดยึดขึ้นไปที่ขอบบนปุ่มล่าง
          upperId: p.upper,
          lowerId: p.lower,
        };
      }
      return null;
    }).filter((c): c is { x1: number; y1: number; x2: number; y2: number; upperId: number; lowerId: number } => Boolean(c));

    setLineCoords(coords);
  }, [sectionPairs, activeTab]);

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    const timer = setTimeout(updateLines, 50);
    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timer);
    };
  }, [updateLines]);

  return (
    // เปลี่ยนจาก max-w-7xl เป็น max-w-6xl และเพิ่ม px-4 เพื่อไม่ให้ชิดขอบจอเกินไปในมือถือ
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-12 pb-24 animate-in fade-in duration-500">

      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Occlusal Analysis</h1>
          <p className="text-slate-500">Select a contact type on the left, then map tooth interactions on the right.</p>
        </div>
        <button
          onClick={() => setSectionPairs({ premature: [], mip: [], protrusive: [], working: [], nonWorking: [] })}
          className="h-10 px-4 rounded-xl text-sm font-bold border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm shrink-0 w-full sm:w-auto"
        >
          Clear All Analysis
        </button>
      </div>

      <TooltipProvider>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* --- LEFT: Contact Types Sidebar --- */}
          <div className="w-full lg:w-64 flex flex-col gap-2.5 shrink-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Contact Types</h3>
            {CONTACT_SECTIONS.map((section) => {
              const isActive = activeTab === section.id;
              const pairCount = sectionPairs[section.id].length;

              return (
                <div
                  key={section.id}
                  onClick={() => handleTabChange(section.id)}
                  className={cn(
                    "flex flex-col p-3.5 rounded-xl cursor-pointer transition-all duration-200 border-2",
                    isActive
                      ? "bg-white border-teal-500 shadow-md ring-4 ring-teal-50"
                      : "bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 text-slate-600"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className={cn("text-sm font-bold", isActive ? "text-teal-900" : "text-slate-700")}>
                        {section.label}
                      </h4>
                      <Tooltip open={!!explanations[section.id] || loadingHelp.has(section.id)}>
                        <TooltipTrigger
                          onClick={(e) => handleHelpClick(section.id, e)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                            isActive ? "bg-teal-100 text-teal-600 hover:bg-teal-200" : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                          )}
                        >
                          {loadingHelp.has(section.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <HelpCircle className="w-3.5 h-3.5" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs bg-slate-900 text-white border-none p-4 rounded-xl shadow-xl">
                          {explanations[section.id] || "Fetching explanation..."}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {isActive && <ChevronRight className="w-5 h-5 text-teal-500" />}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {pairCount > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                        <CheckCircle2 className="w-3 h-3" />
                        {pairCount} pair{pairCount > 1 ? 's' : ''} mapped
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not mapped yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT: Main Teeth Panel --- */}
          {/* เพิ่ม min-w-0 เพื่อป้องกัน flex child ขยายเกินกรอบจอ */}
          <div className="w-full lg:flex-1 min-w-0 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8 flex flex-col relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {CONTACT_SECTIONS.find(s => s.id === activeTab)?.fullLabel}
              </h2>
              {sectionPairs[activeTab].length > 0 && (
                <button
                  onClick={() => setSectionPairs(prev => ({ ...prev, [activeTab]: [] }))}
                  className="px-3 py-1.5 w-max rounded-lg text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  Clear this section
                </button>
              )}
            </div>



            {/* Chart Area: Fit to screen horizontally without scrolling */}
            <div className="w-full pb-4">
              <div className="w-full relative py-4" ref={containerRef}>

                {/* SVG Line Overlay */}
                <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible" width="100%" height="100%">
                  {lineCoords.map((line, i) => {
                    const color = getToothColor(line.upperId);
                    const isHovered = hoveredPair?.upper === line.upperId && hoveredPair?.lower === line.lowerId;
                    const isInterf = checkInterference(activeTab, line.upperId, line.lowerId);
                    const drawColor = isInterf ? '#f43f5e' : color;
                    const opacity = hoveredPair ? (isHovered ? 1 : 0.15) : (isInterf ? 0.95 : 0.65);
                    const strokeWidth = isHovered ? 3 : 1.5;

                    const distanceY = Math.abs(line.y2 - line.y1);
                    const curveOffset = distanceY * 0.4;
                    const pathData = `M ${line.x1} ${line.y1} C ${line.x1} ${line.y1 + curveOffset}, ${line.x2} ${line.y2 - curveOffset}, ${line.x2} ${line.y2}`;

                    return (
                      <g key={i} className="transition-all duration-300 ease-in-out" style={{ opacity }}>
                        <path
                          d={pathData}
                          fill="none"
                          stroke={drawColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={isInterf ? "3 3" : undefined}
                          className={cn("animate-in fade-in duration-500")}
                        />
                        <circle cx={line.x1} cy={line.y1} r={isHovered ? 4 : 2.5} fill={drawColor} />
                        <circle cx={line.x2} cy={line.y2} r={isHovered ? 4 : 2.5} fill={drawColor} />
                      </g>
                    );
                  })}
                </svg>

                {/* Lateral Excursion Side Zone Indicator Labels */}
                {(activeTab === 'working' || activeTab === 'nonWorking') && (
                  <div className="flex justify-between w-full mb-4 px-2 text-[11px] sm:text-xs font-semibold text-slate-400 relative z-10">
                    <span>Right Side (Patient's Right) — {activeTab === 'working' ? 'Working Side' : 'Balancing Side (Interference)'}</span>
                    <span>Left Side (Patient's Left) — {activeTab === 'nonWorking' ? 'Working Side' : 'Balancing Side (Interference)'}</span>
                  </div>
                )}

                {/* Teeth Rows Diagnostic Card Grid */}
                <div className="flex flex-col gap-16 md:gap-20 relative z-10 w-full p-4 md:p-6 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/20">
                  
                  {/* Subtle Midline Divider */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0 border-l border-dashed border-slate-200 z-0 -translate-x-1/2 pointer-events-none" />

                  {/* Upper Jaw Row */}
                  <div className="flex justify-between gap-1 sm:gap-1.5 md:gap-2 w-full relative z-10">
                    {UPPER_TEETH.map(id => {
                      const isSelected = activeSelection?.id === id && activeSelection?.jaw === 'upper';
                      const pairedLowers = sectionPairs[activeTab].filter(p => p.upper === id).map(p => p.lower);
                      const isPaired = pairedLowers.length > 0;
                      
                      // Check if any paired contact is an interference
                      const hasInterference = pairedLowers.some(lowId => checkInterference(activeTab, id, lowId));
                      
                      // Check if it would cause an interference if paired with currently active selection
                      const isInterferencePreview = activeSelection && 
                        activeSelection.jaw === 'lower' && 
                        checkInterference(activeTab, id, activeSelection.id);

                      const color = getToothColor(id);
                      const isDimmed = (hoveredPair && hoveredPair.upper !== id) ||
                        (activeSelection && activeSelection.jaw === 'upper' && activeSelection.id !== id);

                      return (
                        <button
                          key={id}
                          ref={el => { toothRefs.current[id] = el }}
                          onClick={() => onToothClick(id, 'upper')}
                          className={cn(
                            "flex-1 aspect-square max-w-[4rem] rounded-lg sm:rounded-xl md:rounded-2xl border flex flex-col items-center justify-center text-[10px] sm:text-xs md:text-sm font-semibold touch-manipulation transition-all duration-200 relative",
                            isSelected ? "text-white font-bold scale-105 z-20" :
                              isInterferencePreview ? "bg-rose-50 border-rose-300 text-rose-600 z-10 cursor-pointer" :
                                hasInterference ? "bg-rose-50 border-rose-400 text-rose-600 z-10" :
                                  isPaired ? "z-10" :
                                    "bg-white border-slate-200 text-slate-650 hover:border-slate-350 hover:bg-slate-50",
                            isDimmed && !isSelected && "opacity-40 scale-95"
                          )}
                          style={
                            isSelected ? { backgroundColor: color, borderColor: color } :
                              isPaired ? { backgroundColor: `${color}1A`, borderColor: `${color}`, color: color } :
                                {}
                          }
                        >
                          {id}
                        </button>
                      )
                    })}
                  </div>

                  {/* Lower Jaw Row */}
                  <div className="flex justify-between gap-1 sm:gap-1.5 md:gap-2 w-full relative z-10">
                    {LOWER_TEETH.map(id => {
                      const isSelected = activeSelection?.id === id && activeSelection?.jaw === 'lower';
                      const pairedUppers = sectionPairs[activeTab].filter(p => p.lower === id).map(p => p.upper);
                      const isPaired = pairedUppers.length > 0;
                      
                      // Check if any paired contact is an interference
                      const hasInterference = pairedUppers.some(upId => checkInterference(activeTab, upId, id));
                      
                      // Check if it would cause an interference if paired with currently active selection
                      const isInterferencePreview = activeSelection && 
                        activeSelection.jaw === 'upper' && 
                        checkInterference(activeTab, activeSelection.id, id);

                      const color = isPaired ? getToothColor(pairedUppers[0]) : getToothColor(id);
                      const isDimmed = (hoveredPair && hoveredPair.lower !== id) ||
                        (activeSelection && activeSelection.jaw === 'lower' && activeSelection.id !== id);

                      return (
                        <button
                          key={id}
                          ref={el => { toothRefs.current[id] = el }}
                          onClick={() => onToothClick(id, 'lower')}
                          className={cn(
                            "flex-1 aspect-square max-w-[4rem] rounded-lg sm:rounded-xl md:rounded-2xl border flex flex-col items-center justify-center text-[10px] sm:text-xs md:text-sm font-semibold touch-manipulation transition-all duration-200 relative",
                            isSelected ? "text-white font-bold scale-105 z-20" :
                              isInterferencePreview ? "bg-rose-50 border-rose-300 text-rose-600 z-10 cursor-pointer" :
                                hasInterference ? "bg-rose-50 border-rose-400 text-rose-600 z-10" :
                                  isPaired ? "z-10" :
                                    "bg-white border-slate-200 text-slate-650 hover:border-slate-350 hover:bg-slate-50",
                            isDimmed && !isSelected && "opacity-40 scale-95"
                          )}
                          style={
                            isSelected ? { backgroundColor: color, borderColor: color } :
                              isPaired ? { backgroundColor: `${color}1A`, borderColor: `${color}`, color: color } :
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
            </div>

            {/* Current Pairs Status Area */}
            <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
              
              {/* Interference Warning Banner */}
              {sectionPairs[activeTab].some(p => checkInterference(activeTab, p.upper, p.lower)) && (
                 <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-800">Balancing Interference Detected</h4>
                      <p className="text-xs text-rose-600 mt-1 leading-relaxed">
                        During <b>{activeTab === 'working' ? 'Right' : 'Left'} lateral excursion</b>, 
                        the <b>{activeTab === 'working' ? 'Left' : 'Right'} side</b> acts as the Balancing side. 
                        Contacts found here are considered <b>Balancing interferences</b>.
                      </p>
                    </div>
                 </div>
              )}

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mapped Connections</h4>
              <div className="flex flex-wrap gap-3">
                {sectionPairs[activeTab].length === 0 ? (
                  <p className="text-sm text-slate-400 italic bg-slate-50 px-4 py-2 rounded-xl">No contacts mapped yet. Select an upper and lower tooth to create a pair.</p>
                ) : (
                  sectionPairs[activeTab].map((pair, idx) => {
                    const color = getToothColor(pair.upper);
                    const isHovered = hoveredPair?.upper === pair.upper && hoveredPair?.lower === pair.lower;
                    const isInterf = checkInterference(activeTab, pair.upper, pair.lower);

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredPair(pair)}
                        onMouseLeave={() => setHoveredPair(null)}
                        className={cn(
                          "flex items-center gap-2 pl-3 pr-1 py-1 rounded-full cursor-default transition-all duration-200 border",
                          isHovered ? "shadow-md scale-105" : "",
                          isInterf 
                            ? "bg-rose-50 border-rose-300" 
                            : (isHovered ? "bg-white" : "bg-slate-50 border-slate-200")
                        )}
                        style={{ borderColor: isHovered ? (isInterf ? '#f43f5e' : color) : undefined }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isInterf ? '#f43f5e' : color }} />
                        <span className={cn("text-xs font-bold", isInterf ? "text-rose-700" : "text-slate-700")}>{pair.upper} — {pair.lower}</span>
                        {isInterf && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 ml-0.5" />}
                        <button
                          onClick={() => removePair(pair)}
                          className={cn(
                            "w-5 h-5 ml-1 rounded-full flex items-center justify-center transition-colors",
                            isInterf ? "text-rose-400 hover:bg-rose-200 hover:text-rose-700" : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                          )}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* --- Additional Clinical Fields --- */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-800 space-y-10 border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-5">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
            Orthodontic & Occlusal Measurements
          </h2>
        </div>

        <div className="space-y-10">
          {/* Section 1: Angle's Classification */}
          <div className="space-y-6">
            <h4 className="text-teal-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Angle's Classification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Right first molar</Label>
                <ToggleButtonGroup
                  value={angleClass.molarRight}
                  onChange={(v: string) => setAngleClass(prev => ({ ...prev, molarRight: v }))}
                  options={[
                    { value: 'Class I', label: 'Class I' },
                    { value: 'Class II', label: 'Class II' },
                    { value: 'Class III', label: 'Class III' }
                  ]}
                  name="molarRight"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Left first molar</Label>
                <ToggleButtonGroup
                  value={angleClass.molarLeft}
                  onChange={(v: string) => setAngleClass(prev => ({ ...prev, molarLeft: v }))}
                  options={[
                    { value: 'Class I', label: 'Class I' },
                    { value: 'Class II', label: 'Class II' },
                    { value: 'Class III', label: 'Class III' }
                  ]}
                  name="molarLeft"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Right Canine (k9)</Label>
                <ToggleButtonGroup
                  value={angleClass.canineRight}
                  onChange={(v: string) => setAngleClass(prev => ({ ...prev, canineRight: v }))}
                  options={[
                    { value: 'Class I', label: 'Class I' },
                    { value: 'Class II', label: 'Class II' },
                    { value: 'Class III', label: 'Class III' }
                  ]}
                  name="canineRight"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Left Canine (k9)</Label>
                <ToggleButtonGroup
                  value={angleClass.canineLeft}
                  onChange={(v: string) => setAngleClass(prev => ({ ...prev, canineLeft: v }))}
                  options={[
                    { value: 'Class I', label: 'Class I' },
                    { value: 'Class II', label: 'Class II' },
                    { value: 'Class III', label: 'Class III' }
                  ]}
                  name="canineLeft"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            {/* Section 2: Overlaps */}
            <div className="space-y-6">
              <h4 className="text-teal-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                Overlap (mm)
              </h4>
              <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner h-[calc(100%-40px)]">
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold">Horizontal</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={overlaps.horizontal}
                      onChange={e => setOverlaps(prev => ({ ...prev, horizontal: e.target.value }))}
                      className="bg-white border-slate-200 text-slate-800 h-12 rounded-xl focus:ring-teal-500 pr-10 shadow-sm"
                      placeholder="e.g. 2"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mm</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold">Vertical</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={overlaps.vertical}
                      onChange={e => setOverlaps(prev => ({ ...prev, vertical: e.target.value }))}
                      className="bg-white border-slate-200 text-slate-800 h-12 rounded-xl focus:ring-teal-500 pr-10 shadow-sm"
                      placeholder="e.g. 2"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: CR-MIP Discrepancy */}
            <div className="space-y-6">
              <h4 className="text-teal-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                CR—MIP Discrepancy
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold">Anterior slide</Label>
                  <div className="relative">
                    <Input type="number" step="0.1" value={crmip.anteriorSlide} onChange={e => setCrmip(prev => ({ ...prev, anteriorSlide: e.target.value }))} className="bg-white border-slate-200 text-slate-800 h-12 rounded-xl focus:ring-teal-500 pr-10 shadow-sm" placeholder="0.0" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mm</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-slate-700 font-semibold">Lateral slide</Label>
                  <div className="relative">
                    <Input type="number" step="0.1" value={crmip.lateralSlide} onChange={e => setCrmip(prev => ({ ...prev, lateralSlide: e.target.value }))} className="bg-white border-slate-200 text-slate-800 h-12 rounded-xl focus:ring-teal-500 pr-10 shadow-sm" placeholder="0.0" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mm</span>
                  </div>
                  <div className="pt-2">
                    <ToggleButtonGroup
                      value={crmip.lateralDir}
                      onChange={(v: string) => setCrmip(prev => ({ ...prev, lateralDir: v }))}
                      options={[
                        { value: 'Right', label: 'Right' },
                        { value: 'Left', label: 'Left' }
                      ]}
                      name="lateralDir"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}