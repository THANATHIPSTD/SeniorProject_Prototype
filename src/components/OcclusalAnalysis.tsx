
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, X, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
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

            {/* พื้นที่ของฟันซึ่งมีการบังคับ Scroll แนวนอนหากจอเล็กไป */}
            <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
              {/* จุดอ้างอิงสำหรับการวาดเส้น (containerRef) ถูกย้ายมาอยู่ที่กล่องนี้แทน */}
              <div className="min-w-max relative py-4 px-2" ref={containerRef}>

                {/* SVG Line Overlay */}
                <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible" width="100%" height="100%">
                  {lineCoords.map((line, i) => {
                    const color = getToothColor(line.upperId);
                    const isHovered = hoveredPair?.upper === line.upperId && hoveredPair?.lower === line.lowerId;
                    const opacity = hoveredPair ? (isHovered ? 1 : 0.15) : 0.6;
                    const strokeWidth = isHovered ? 3.5 : 2;

                    const distanceY = Math.abs(line.y2 - line.y1);
                    const curveOffset = distanceY * 0.4;
                    const pathData = `M ${line.x1} ${line.y1} C ${line.x1} ${line.y1 + curveOffset}, ${line.x2} ${line.y2 - curveOffset}, ${line.x2} ${line.y2}`;

                    return (
                      <g key={i} className="transition-all duration-300 ease-in-out" style={{ opacity }}>
                        <path
                          d={pathData}
                          fill="none"
                          stroke={color}
                          strokeWidth={strokeWidth}
                          className={cn("animate-in fade-in duration-500", !isHovered && "stroke-dasharray-none")}
                        />
                        <circle cx={line.x1} cy={line.y1} r={isHovered ? 4 : 3} fill={color} />
                        <circle cx={line.x2} cy={line.y2} r={isHovered ? 4 : 3} fill={color} />
                      </g>
                    );
                  })}
                </svg>

                {/* Teeth Rows */}
                <div className="flex flex-col gap-12 relative z-10">
                  {/* Upper Jaw Row */}
                  <div className="flex justify-center gap-1.5">
                    {UPPER_TEETH.map(id => {
                      const isSelected = activeSelection?.id === id && activeSelection?.jaw === 'upper';
                      const isPaired = sectionPairs[activeTab].some(p => p.upper === id);
                      const color = getToothColor(id);
                      const isDimmed = hoveredPair && hoveredPair.upper !== id;

                      return (
                        <button
                          key={id}
                          ref={el => { toothRefs.current[id] = el }}
                          onClick={() => onToothClick(id, 'upper')}
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl border-2 flex items-center justify-center text-sm md:text-base font-bold touch-manipulation transition-all duration-300",
                            isSelected ? "text-white shadow-xl scale-110 z-20" :
                              isPaired ? "bg-opacity-10 z-10" :
                                "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50",
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
                  <div className="flex justify-center gap-1.5">
                    {LOWER_TEETH.map(id => {
                      const isSelected = activeSelection?.id === id && activeSelection?.jaw === 'lower';
                      const pairedUppers = sectionPairs[activeTab].filter(p => p.lower === id).map(p => p.upper);
                      const isPaired = pairedUppers.length > 0;
                      const color = isPaired ? getToothColor(pairedUppers[0]) : getToothColor(id);
                      const isDimmed = hoveredPair && hoveredPair.lower !== id;

                      return (
                        <button
                          key={id}
                          ref={el => { toothRefs.current[id] = el }}
                          onClick={() => onToothClick(id, 'lower')}
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl border-2 flex items-center justify-center text-sm md:text-base font-bold touch-manipulation transition-all duration-300",
                            isSelected ? "text-white shadow-xl scale-110 z-20" :
                              isPaired ? "bg-opacity-10 z-10" :
                                "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50",
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
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mapped Connections</h4>
              <div className="flex flex-wrap gap-3">
                {sectionPairs[activeTab].length === 0 ? (
                  <p className="text-sm text-slate-400 italic bg-slate-50 px-4 py-2 rounded-xl">No contacts mapped yet. Select an upper and lower tooth to create a pair.</p>
                ) : (
                  sectionPairs[activeTab].map((pair, idx) => {
                    const color = getToothColor(pair.upper);
                    const isHovered = hoveredPair?.upper === pair.upper && hoveredPair?.lower === pair.lower;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredPair(pair)}
                        onMouseLeave={() => setHoveredPair(null)}
                        className={cn(
                          "flex items-center gap-2 pl-3 pr-1 py-1 rounded-full cursor-default transition-all duration-200 border",
                          isHovered ? "bg-white shadow-md scale-105" : "bg-slate-50 border-slate-200"
                        )}
                        style={{ borderColor: isHovered ? color : undefined }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-bold text-slate-700">{pair.upper} — {pair.lower}</span>
                        <button
                          onClick={() => removePair(pair)}
                          className="w-5 h-5 ml-1 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
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
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-12 shadow-xl">
        <div className="border-b border-slate-800 pb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Orthodontic & Occlusal Measurements
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
          {/* Angle's Classification */}
          <div className="space-y-8">
            <h4 className="text-teal-400 text-sm font-bold uppercase tracking-widest">Angle's Classification</h4>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-slate-300">Right first molar</Label>
                <RadioGroup value={angleClass.molarRight} onValueChange={(v: string) => setAngleClass(prev => ({ ...prev, molarRight: v }))} className="flex flex-wrap gap-4">
                  {['Class I', 'Class II', 'Class III'].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                      <RadioGroupItem value={val} id={`mr-${val}`} className="border-slate-500" />
                      <Label htmlFor={`mr-${val}`} className="text-xs font-medium cursor-pointer">{val}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-4">
                <Label className="text-slate-300">Left first molar</Label>
                <RadioGroup value={angleClass.molarLeft} onValueChange={(v: string) => setAngleClass(prev => ({ ...prev, molarLeft: v }))} className="flex flex-wrap gap-4">
                  {['Class I', 'Class II', 'Class III'].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                      <RadioGroupItem value={val} id={`ml-${val}`} className="border-slate-500" />
                      <Label htmlFor={`ml-${val}`} className="text-xs font-medium cursor-pointer">{val}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-4 border-t border-slate-800 pt-6">
                <Label className="text-slate-300">Right Canine (k9)</Label>
                <RadioGroup value={angleClass.canineRight} onValueChange={(v: string) => setAngleClass(prev => ({ ...prev, canineRight: v }))} className="flex flex-wrap gap-4">
                  {['Class I', 'Class II', 'Class III'].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                      <RadioGroupItem value={val} id={`cr-${val}`} className="border-slate-500" />
                      <Label htmlFor={`cr-${val}`} className="text-xs font-medium cursor-pointer">{val}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-4">
                <Label className="text-slate-300">Left Canine (k9)</Label>
                <RadioGroup value={angleClass.canineLeft} onValueChange={(v: string) => setAngleClass(prev => ({ ...prev, canineLeft: v }))} className="flex flex-wrap gap-4">
                  {['Class I', 'Class II', 'Class III'].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                      <RadioGroupItem value={val} id={`cl-${val}`} className="border-slate-500" />
                      <Label htmlFor={`cl-${val}`} className="text-xs font-medium cursor-pointer">{val}</Label>
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
                <Input type="number" value={overlaps.horizontal} onChange={e => setOverlaps(prev => ({ ...prev, horizontal: e.target.value }))} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-teal-500" placeholder="mm" />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-300">Vertical</Label>
                <Input type="number" value={overlaps.vertical} onChange={e => setOverlaps(prev => ({ ...prev, vertical: e.target.value }))} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-teal-500" placeholder="mm" />
              </div>
            </div>
          </div>

          {/* CR-MIP Discrepancy */}
          <div className="space-y-8 lg:col-span-2 border-t border-slate-800 pt-10">
            <h4 className="text-teal-400 text-sm font-bold uppercase tracking-widest">CR—MIP Discrepancy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
              <div className="space-y-3">
                <Label className="text-slate-300">Anterior slide</Label>
                <div className="relative">
                  <Input type="number" step="0.1" value={crmip.anteriorSlide} onChange={e => setCrmip(prev => ({ ...prev, anteriorSlide: e.target.value }))} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-teal-500 pr-10" placeholder="0.0" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">mm</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-slate-300">Lateral slide</Label>
                <div className="relative">
                  <Input type="number" step="0.1" value={crmip.lateralSlide} onChange={e => setCrmip(prev => ({ ...prev, lateralSlide: e.target.value }))} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl focus:ring-teal-500 pr-10" placeholder="0.0" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">mm</span>
                </div>
                <div className="pt-2">
                  <RadioGroup value={crmip.lateralDir} onValueChange={(v: string) => setCrmip(prev => ({ ...prev, lateralDir: v }))} className="flex gap-2 bg-slate-800 p-1.5 rounded-xl w-full">
                    {['Right', 'Left'].map(dir => (
                      <div key={dir} className={cn(
                        "flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all",
                        crmip.lateralDir === dir ? "bg-teal-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                      )} onClick={() => setCrmip(prev => ({ ...prev, lateralDir: dir }))}>
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