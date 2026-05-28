
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/store/usePatientStore';
import { ArrowLeft, Save, Upload, Trash2, X, ChevronRight, AlertCircle, FileText, HeartPulse, Stethoscope, UserSquare2, Activity, Zap, Info, Sparkles, ScanFace, Smile, Mic2, Ruler, AlertTriangle, UserMinus, Focus, Layers, Droplets, Brain, Maximize, CalendarDays, Clock, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageStore } from '@/store/useImageStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleButtonGroup } from '@/components/ui/ToggleButton';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import OdontogramUI from '@/components/odontogram/OdontogramUI';
import OcclusalAnalysis from '@/components/OcclusalAnalysis';
import { FaceMuscleChart } from '@/components/FaceMuscleChart';
import { RankedExpectationSelector } from '@/components/RankedExpectationSelector';
import { FacialSymmetry } from '@/components/FacialSymmetry';
import { FacialProfile } from '@/components/FacialProfile';

const MedicalIcon = ({ type, className }: { type: string; className?: string }) => {
    const base = "w-full h-16 sm:h-20 mb-2 rounded-lg border bg-slate-50 flex items-center justify-center p-2 transition-colors";

    const renderGraphic = () => {
        switch (type) {
            case 'smile-avg':
                return <svg viewBox="0 0 100 50" className="w-16 h-8"><path d="M10 25 Q50 45 90 25 Q50 35 10 25" fill="#fff" stroke="#94a3b8" strokeWidth="2" /><path d="M15 26 Q50 40 85 26" fill="none" stroke="#cbd5e1" strokeWidth="1" /></svg>;
            case 'smile-high':
                return <svg viewBox="0 0 100 50" className="w-16 h-8"><path d="M10 25 Q50 45 90 25 L90 15 Q50 35 10 15 Z" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="1" /><path d="M10 25 Q50 45 90 25 Q50 35 10 25" fill="#fff" stroke="#94a3b8" strokeWidth="2" /></svg>;
            case 'smile-low':
                return <svg viewBox="0 0 100 50" className="w-16 h-8"><path d="M10 15 Q50 35 90 15 Q50 25 10 15" fill="#fff" stroke="#94a3b8" strokeWidth="2" /></svg>;
            case 'curve-convex':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M20 10 Q50 35 80 10" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" /><rect x="42" y="5" width="16" height="20" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="25" y="5" width="14" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="61" y="5" width="14" height="15" rx="2" fill="#fff" stroke="#94a3b8" /></svg>;
            case 'curve-straight':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M20 25 L80 25" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" /><rect x="42" y="5" width="16" height="17" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="25" y="5" width="14" height="17" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="61" y="5" width="14" height="17" rx="2" fill="#fff" stroke="#94a3b8" /></svg>;
            case 'curve-reverse':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M20 30 Q50 10 80 30" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" /><rect x="42" y="5" width="16" height="12" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="25" y="5" width="14" height="18" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="61" y="5" width="14" height="18" rx="2" fill="#fff" stroke="#94a3b8" /></svg>;
            case 'mid-center':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><rect x="10" y="10" width="80" height="20" rx="4" fill="#fff" stroke="#94a3b8" /><line x1="50" y1="0" x2="50" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" /></svg>;
            case 'mid-left':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><rect x="10" y="10" width="80" height="20" rx="4" fill="#fff" stroke="#94a3b8" /><line x1="65" y1="0" x2="65" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" /></svg>;
            case 'mid-right':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><rect x="10" y="10" width="80" height="20" rx="4" fill="#fff" stroke="#94a3b8" /><line x1="35" y1="0" x2="35" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" /></svg>;
            case 'teeth-6':
                return <svg viewBox="0 0 100 30" className="w-16 h-6"><path d="M25 15 Q50 25 75 15" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 10" /></svg>;
            case 'teeth-8':
                return <svg viewBox="0 0 100 30" className="w-16 h-6"><path d="M15 10 Q50 25 85 10" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 10" /></svg>;
            case 'teeth-10':
                return <svg viewBox="0 0 100 30" className="w-16 h-6"><path d="M5 5 Q50 25 95 5" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 10" /></svg>;
            case 'teeth-16':
                return <svg viewBox="0 0 100 30" className="w-16 h-6"><path d="M0 5 Q50 25 100 5 M0 25 Q50 5 100 25" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 8" /></svg>;
            case 'lip-touching':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M15 10 Q50 35 85 10" fill="#fff" stroke="#94a3b8" strokeWidth="2" /><path d="M10 15 Q50 35 90 15" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" /></svg>;
            case 'lip-not-touching':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M20 10 Q50 25 80 10" fill="#fff" stroke="#94a3b8" strokeWidth="2" /><path d="M10 20 Q50 40 90 20" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" /></svg>;
            case 'lip-covered':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M15 10 Q50 45 85 10" fill="#fff" stroke="#94a3b8" strokeWidth="2" /><path d="M10 25 Q50 20 90 25 Q50 38 10 25" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="1" /></svg>;
            case 'mid-ul-right':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><rect x="15" y="5" width="70" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="25" y="20" width="50" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><line x1="56" y1="2" x2="56" y2="20" stroke="#ef4444" strokeWidth="1.5" /><line x1="50" y1="20" x2="50" y2="38" stroke="#3b82f6" strokeWidth="1.5" /></svg>;
            case 'mid-ul-left':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><rect x="15" y="5" width="70" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="25" y="20" width="50" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><line x1="44" y1="2" x2="44" y2="20" stroke="#ef4444" strokeWidth="1.5" /><line x1="50" y1="20" x2="50" y2="38" stroke="#3b82f6" strokeWidth="1.5" /></svg>;
            case 'mid-ul-straight':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><rect x="15" y="5" width="70" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><rect x="25" y="20" width="50" height="15" rx="2" fill="#fff" stroke="#94a3b8" /><line x1="50" y1="2" x2="50" y2="38" stroke="#10b981" strokeWidth="1.5" /></svg>;
            case 'buccal-normal':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M5 20 Q50 45 95 20 Q50 5 5 20" fill="#1e293b" /><path d="M12 20 Q50 38 88 20 Q50 10 12 20" fill="#fff" stroke="#94a3b8" strokeWidth="1" /></svg>;
            case 'buccal-increased':
                return <svg viewBox="0 0 100 40" className="w-16 h-8"><path d="M5 20 Q50 45 95 20 Q50 5 5 20" fill="#1e293b" /><path d="M28 20 Q50 35 72 20 Q50 12 28 20" fill="#fff" stroke="#94a3b8" strokeWidth="1" /></svg>;
            default:
                return <div className="w-8 h-8 rounded-full bg-slate-200" />;
        }
    };

    return <div className={cn(base, className)}>{renderGraphic()}</div>;
};

const TextCard = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        className={cn(
            "px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-bold text-center",
            isSelected ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        )}
    >
        {label}
    </div>
);



const sectionNames: Record<string, string> = {
    images: 'Images',
    patientHistory: 'Patient History',
    extraoral: 'Extraoral Exam',
    esthetic: 'Esthetic Evaluation',
    vdo: 'VDO Evaluation',
    occlusal: 'Occlusal Analysis',
    residualRidge: 'Residual Ridge Area'
};

const SectionNotes = ({ sectionId, formData, updateField }: { sectionId: string, formData: FormState, updateField: (k: keyof FormState, v: unknown) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAttention, setShowAttention] = useState(true);
    const popoverRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const value = formData.sectionNotes?.[sectionId] || '';
    const sectionName = sectionNames[sectionId] || 'Section';

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAttention(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(
                        textareaRef.current.value.length,
                        textareaRef.current.value.length
                    );
                }
            }, 50);
        }
    }, [isOpen]);

    return (
        <div className="fixed right-6 md:right-8 bottom-6 md:bottom-8 z-40" ref={popoverRef}>
            {/* Attention Grabber Speech Bubble */}
            {showAttention && !value && !isOpen && (
                <div className="absolute right-0 bottom-14 md:bottom-16 z-50 flex flex-col items-end animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-2xl flex items-center gap-2 whitespace-nowrap border border-slate-800">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                        <span>Add clinical notes for {sectionName}!</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAttention(false);
                            }}
                            className="ml-1 rounded-full p-0.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            title="Dismiss"
                        >
                            <X size={12} />
                        </button>
                    </div>
                    {/* Arrow pointing down into the button */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 mr-5 md:mr-6"></div>
                </div>
            )}

            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowAttention(false);
                }}
                title={value ? `${sectionName} Note (Note exists)` : `Add ${sectionName} Note`}
                aria-label={value ? `${sectionName} Note (Note exists)` : `Add ${sectionName} Note`}
                className={cn(
                    "flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full transition-all duration-300 shadow-xl border focus:outline-none focus:ring-4 focus:ring-teal-500/20 group relative hover:scale-105 active:scale-95",
                    value
                        ? "bg-gradient-to-br from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white border-teal-600 shadow-teal-500/20"
                        : "bg-gradient-to-br from-teal-50 to-white hover:from-teal-100 hover:to-teal-50 text-teal-600 border-teal-200 shadow-slate-200/50"
                )}
            >
                <FileText className="w-5 h-5 md:w-6 h-6" />
                
                {/* Glowing alert outer ring for attention */}
                {!value && !isOpen && (
                    <span className="absolute -inset-1 rounded-full bg-teal-400/10 animate-pulse pointer-events-none -z-10"></span>
                )}

                {value && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-teal-500 border border-white"></span>
                    </span>
                )}
                
                {/* Expand label on hover */}
                <span className="absolute right-14 md:right-16 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                    {value ? `Edit ${sectionName} Note` : `Add ${sectionName} Note`}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-16 md:bottom-20 z-50 w-80 md:w-96 max-w-[calc(100vw-48px)] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-4">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-teal-500" /> {sectionName} Note
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => updateField('sectionNotes', { ...formData.sectionNotes, [sectionId]: e.target.value })}
                        placeholder={`Type additional clinical notes for ${sectionName.toLowerCase()}...`}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 min-h-[140px] resize-y shadow-inner"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>Saved automatically</span>
                        {value && (
                            <button
                                type="button"
                                onClick={() => {
                                    updateField('sectionNotes', { ...formData.sectionNotes, [sectionId]: '' });
                                    setIsOpen(false);
                                }}
                                className="text-rose-500 hover:text-rose-600 hover:underline font-semibold"
                            >
                                Clear Note
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const VisualCard = ({ id, label, svgType, imagePath, isSelected, onClick, cardClassName, iconClassName }: { id: string; label: string; svgType?: string; imagePath?: string; isSelected: boolean; onClick: () => void; cardClassName?: string; iconClassName?: string }) => (
    <div
        data-id={id}
        onClick={onClick}
        className={cn(
            "p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-sm font-bold text-center group",
            isSelected ? "border-teal-500 bg-teal-50 text-teal-900 shadow-md ring-2 ring-teal-100 ring-offset-1" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            cardClassName
        )}
    >
        {imagePath ? (
            <img
                src={imagePath}
                alt={label}
                className={cn("mb-3 object-contain rounded-lg border-2 transition-colors", isSelected ? "border-teal-300" : "border-slate-100 group-hover:border-slate-200", iconClassName)}
            />
        ) : (
            <MedicalIcon type={svgType || ""} className={cn(isSelected ? "border-teal-200 bg-white" : "border-slate-100 group-hover:border-slate-200", iconClassName)} />
        )}
        <span>{label}</span>
    </div>
);

// 8 Sections Requested by User:
const SECTIONS = [
    { id: 'images', title: 'Images' },
    { id: 'patientHistory', title: 'Patient History' },
    { id: 'extraoral', title: 'Extraoral examination' },
    { id: 'esthetic', title: 'Esthetic evaluation' },
    { id: 'vdo', title: 'VDO evaluations' },
    { id: 'dentalStatus', title: 'Dental status ' },
    { id: 'occlusal', title: 'Occlusal analysis' },
    { id: 'residualRidge', title: 'Residual ridge area' }
];

interface Medication {
    id: string;
    name: string;
    dose: string;
    frequency: string;
    dosePerTime: string;
    timeOfDay: string;
}

interface FormState {
    chiefComplaint: string; presentIllness: string;
    medicalHistory: string; medications: Medication[];
    seeDoctorRegularly: string;
    regularDoctorMonths: string;
    clinicName: string;
    allergyStatus: string;
    allergyDetails: string;
    dentalHistory: string;
    patientExpectation: string[];
    otherExpectation: string;
    selfEvaluation: string;
    expectedOutcomeDetail: string;
    edentulousTime: string;
    previousDentureCount: string;
    presentDentureAge: string;
    dentureComplaint: string;
    facialSymmetry: string; facialProfile: string;
    musclePain: string[];
    jointPain: string[];
    jointSound: string;
    jawDeviation: string;
    jawDeviationMm: string;
    limitedOpening: string;
    openingMm: string;
    limitedBorder: string;
    borderDetail: string;
    parafunctionalHabits: string[];
    habitOther: string;
    toothWearFactors: string[];
    wearHardFoodDetail: string;
    wearOtherDetail: string;
    occlusalPlane: string;
    facialMidline: string;
    facialMidlineMm: string;
    lipFullness: string;
    lipLength: string;
    toothExpUpper: string;
    toothExpLower: string;
    nasolabialAngle: string;
    smileLine: string;
    incisalCurve: string;
    lipPosition: string;
    teethExposed: string;
    midlinePhiltrum: string;
    midlineIncisors: string;
    buccalCorridor: string;
    fvSound: string;
    sSoundMm: string;
    sSoundRef: string;
    lipAtRest: string; midlineDiscrepancy: string; midlineShiftMm: string;
    vdoSoftTissueContour: string[];
    vdoSpeakingSpaceRef: string;
    vdoBiteType: string;
    vdoFreewaySpaceMm: string;
    ridgeWidth: string;
    jawSize: string;
    ridgeShapeU: string;
    ridgeShapeL: string;
    ridgeRelation: string;
    ridgeParallelism: string;
    interridgeSpace: string;
    lowerArchForm: string;
    palatalThroatForm: string;
    tonguePosition: string;
    salivaConsistency: string;
    lipMobility: string;
    facialMuscleTone: string;
    torusPresent: string[];
    frenumU: string[];
    frenumL: string[];
    ridgeDeformity: string[];
    exostosisDetail: string;
    bonySpiculeDetail: string;
    vdoNasolabialFold: string; vdoDroopingCommissure: string; vdoThinLips: string; closestSpeakingSpace: string; freewaySpace: string;
    ridgeHeight: string; ridgeShapeUpper: string; ridgeShapeLower: string; palatalVault: string;
    tongueSize: string; amountOfSaliva: string; mentalAttitude: string;
    sectionNotes: Record<string, string>;
}

const DEFAULT_STATE: FormState = {
    chiefComplaint: '', presentIllness: '', medicalHistory: '', medications: [],
    seeDoctorRegularly: 'no', regularDoctorMonths: '', clinicName: '', allergyStatus: 'deny', allergyDetails: '',
    dentalHistory: '',
    patientExpectation: [],
    otherExpectation: '', selfEvaluation: '', expectedOutcomeDetail: '',
    edentulousTime: '', previousDentureCount: '', presentDentureAge: '', dentureComplaint: '',
    facialSymmetry: 'symmetry', facialProfile: 'straight', musclePain: [], jointPain: [], jointSound: 'no', jawDeviation: 'none', jawDeviationMm: '', limitedOpening: 'no', openingMm: '', limitedBorder: 'no', borderDetail: '', parafunctionalHabits: [], habitOther: '', toothWearFactors: [], wearHardFoodDetail: '', wearOtherDetail: '',
    occlusalPlane: 'parallel', facialMidline: 'symmetric', facialMidlineMm: '', lipFullness: 'average', lipLength: 'average', toothExpUpper: '', toothExpLower: '', nasolabialAngle: '90', smileLine: 'average', incisalCurve: 'convex', lipPosition: 'not-touching', teethExposed: '8', midlinePhiltrum: 'center', midlineIncisors: 'straight', buccalCorridor: 'normal', fvSound: 'yes', sSoundMm: '', sSoundRef: '', lipAtRest: '', midlineDiscrepancy: '', midlineShiftMm: '',
    vdoSoftTissueContour: [], vdoSpeakingSpaceRef: '', vdoBiteType: 'normal', vdoFreewaySpaceMm: '',
    ridgeWidth: 'Round', jawSize: 'Medium', ridgeShapeU: 'U shape', ridgeShapeL: 'U shape', ridgeRelation: 'Class I', ridgeParallelism: 'Parallel', interridgeSpace: 'Sufficient', lowerArchForm: 'Square', palatalThroatForm: 'class-i', tonguePosition: 'Normal', salivaConsistency: 'thick', lipMobility: 'Normal', facialMuscleTone: 'average', torusPresent: [], frenumU: [], frenumL: [], ridgeDeformity: [], exostosisDetail: '', bonySpiculeDetail: '',
    vdoNasolabialFold: 'Normal', vdoDroopingCommissure: 'No', vdoThinLips: 'No', closestSpeakingSpace: '', freewaySpace: '',
    ridgeHeight: '', ridgeShapeUpper: '', ridgeShapeLower: '', palatalVault: '', tongueSize: '', amountOfSaliva: '', mentalAttitude: '',
    sectionNotes: {}
};

const MOCK_JANE_DOE_STATE: FormState = {
    ...DEFAULT_STATE,
    // Patient History
    chiefComplaint: 'Toothache in lower left quadrant for the past 3 days. Pain increases when drinking cold water.',
    presentIllness: 'Patient reports sharp pain on tooth #36 when exposed to cold or sweet foods. No spontaneous pain at night. Pain subsides after a few minutes.',
    medicalHistory: 'Generally healthy. No history of systemic diseases.',
    medications: [
        { id: 'm1', name: 'Ibuprofen', dose: '400mg', frequency: 'PRN', dosePerTime: '1 tablet', timeOfDay: 'When experiencing pain' }
    ],
    seeDoctorRegularly: 'yes',
    regularDoctorMonths: '6',
    clinicName: 'HealthPlus Clinic',
    allergyStatus: 'allergic',
    allergyDetails: 'Penicillin - Causes rash and swelling.',
    dentalHistory: 'Regular checkups every 6 months. Had orthodontic treatment in teens. Last cleaning was 1 year ago.',
    patientExpectation: ['function', 'esthetic', 'pain-relief'],
    otherExpectation: 'Wants the tooth colored filling to match perfectly.',
    selfEvaluation: 'Feels her oral hygiene could be better, admits to not flossing daily.',
    expectedOutcomeDetail: 'Wants to chew normally on the left side again without pain.',

    // Prosthodontic / Denture History
    edentulousTime: 'N/A',
    previousDentureCount: '0',
    presentDentureAge: 'N/A',
    dentureComplaint: 'No dentures present.',

    // Extraoral Exam
    facialSymmetry: 'symmetry',
    facialProfile: 'straight',
    musclePain: ['masseter'],
    jointPain: ['left'],
    jointSound: 'click',
    jawDeviation: 'left',
    jawDeviationMm: '2',
    limitedOpening: 'no',
    openingMm: '45',
    limitedBorder: 'yes',
    borderDetail: 'Slight limitation upon right lateral excursion.',
    parafunctionalHabits: ['clenching', 'bruxism'],
    habitOther: 'Occasional nail biting.',
    toothWearFactors: ['attrition', 'abrasion'],
    wearHardFoodDetail: 'Eats ice and hard nuts frequently.',
    wearOtherDetail: 'Uses hard bristle toothbrush.',

    // Esthetic Evaluation
    occlusalPlane: 'parallel',
    facialMidline: 'symmetric',
    facialMidlineMm: '0',
    lipFullness: 'average',
    lipLength: 'average',
    toothExpUpper: '3',
    toothExpLower: '1',
    nasolabialAngle: '95',
    smileLine: 'average',
    incisalCurve: 'convex',
    lipPosition: 'touching',
    teethExposed: '8',
    midlinePhiltrum: 'center',
    midlineIncisors: 'straight',
    buccalCorridor: 'normal',
    fvSound: 'yes',
    sSoundMm: '1',
    sSoundRef: 'Class I',
    lipAtRest: 'touching',
    midlineDiscrepancy: 'yes',
    midlineShiftMm: '1.5',

    // VDO Evaluation
    vdoSoftTissueContour: ['normal'],
    vdoSpeakingSpaceRef: 'S sound adequate',
    vdoBiteType: 'normal',
    vdoFreewaySpaceMm: '2.5',
    vdoNasolabialFold: 'Normal',
    vdoDroopingCommissure: 'No',
    vdoThinLips: 'No',
    closestSpeakingSpace: '1mm',
    freewaySpace: '2mm',

    // Intraoral / Ridge Evaluation
    ridgeWidth: 'Round',
    jawSize: 'Medium',
    ridgeShapeU: 'U shape',
    ridgeShapeL: 'U shape',
    ridgeRelation: 'Class I',
    ridgeParallelism: 'Parallel',
    interridgeSpace: 'Sufficient',
    lowerArchForm: 'Ovoid',
    palatalThroatForm: 'class-i',
    tonguePosition: 'Normal',
    salivaConsistency: 'normal',
    lipMobility: 'Normal',
    facialMuscleTone: 'average',
    torusPresent: ['palatinus'],
    frenumU: ['normal'],
    frenumL: ['normal'],
    ridgeDeformity: ['none'],
    exostosisDetail: 'Mild buccal exostosis in maxillary premolar region.',
    bonySpiculeDetail: 'None detected.',
    ridgeHeight: 'Adequate',
    ridgeShapeUpper: 'U-shaped',
    ridgeShapeLower: 'U-shaped',
    palatalVault: 'Medium depth',
    tongueSize: 'Normal',
    amountOfSaliva: 'Normal',
    mentalAttitude: 'Philosophical',

    // Notes
    sectionNotes: {
        'patientHistory': 'Patient is slightly anxious about dental procedures. Use topical anesthetic before injection.',
        'extraoral': 'Slight tenderness upon palpation of left masseter muscle. Likely related to clenching habit.',
        'intraoral': 'Gingiva appears slightly inflamed around #36. Deep carious lesion visible on occlusal surface of #36.',
        'esthetic': 'Patient expressed interest in minor teeth whitening after the current pain issue is resolved.'
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RadioCard = ({ label, value, currentValue, onChange, className }: { label: string, value: string, currentValue: string, onChange: (v: string) => void, className?: string }) => {
    const isSelected = currentValue === value;
    return (
        <button
            type="button"
            onClick={() => onChange(value)}
            className={cn(
                "flex items-center justify-center px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                isSelected ? "border-teal-500 bg-teal-50 text-teal-800 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                className
            )}
        >
            {label}
        </button>
    );
};

const SelectCard = ({ label, subLabel, isSelected, onClick, type = 'radio' }: { label: string; subLabel?: string; isSelected: boolean; onClick: () => void; type?: 'radio' | 'checkbox' }) => (
    <div
        onClick={onClick}
        data-type={type}
        className={cn(
            "px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center select-none",
            isSelected
                ? "border-teal-500 bg-teal-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        )}
    >
        <span className={cn("text-sm font-bold", isSelected ? "text-teal-900" : "text-slate-700")}>{label}</span>
        {subLabel && <span className={cn("text-xs mt-0.5", isSelected ? "text-teal-600" : "text-slate-400")}>{subLabel}</span>}
    </div>
);

export default function SequentialPatientPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { patients, updatePatient } = usePatientStore();
    const { images, addImage, removeImage } = useImageStore();

    const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const patient = patients.find((p) => p.id === idStr);

    const [activeSection, setActiveSection] = useState<string>('images');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [visitDate, setVisitDate] = useState<Date | undefined>(
        patient?.lastVisit ? parseISO(patient.lastVisit) : undefined
    );

    const initialFormState = idStr === '1' ? MOCK_JANE_DOE_STATE : DEFAULT_STATE;
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [medFormInput, setMedFormInput] = useState({
        name: '',
        dose: '',
        frequency: '',
        dosePerTime: '',
        timeOfDay: ''
    });
    const [hasMedications, setHasMedications] = useState<boolean | null>(
        formData.medications.length > 0 ? true : null
    );

    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!patient) return <div className="p-8">Patient not found</div>;

    const patientImages = images.filter((img) => img.patientId === patient.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateField = (field: keyof FormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayField = (field: keyof FormState, value: string) => {
        setFormData(prev => {
            const arr = prev[field] as string[];
            if (arr.includes(value)) {
                return { ...prev, [field]: arr.filter(item => item !== value) };
            }
            return { ...prev, [field]: [...arr, value] };
        });
    };

    const isVdoLost = Number(formData.vdoFreewaySpaceMm) > 4;

    const handleSave = () => {
        updatePatient(patient.id, {
            lastVisit: visitDate ? format(visitDate, 'yyyy-MM-dd') : undefined,
        });
        alert('Patient record saved successfully!');
        navigate(`/patients`);
    };

    const handleMockUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            addImage({
                patientId: patient.id,
                type: 'intraoral',
                filename: `simulated_image_${Date.now()}.png`,
                url: `/intraoral.png?random=${Date.now()}`
            });
            setIsUploading(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Top Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
                <div className="flex items-center gap-4 border-slate-200 pr-4">
                    <Button variant="ghost" className="p-2 h-auto text-slate-500 hover:bg-slate-100" onClick={() => navigate(`/patients`)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            {patient.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <span>{patient.hn}</span>
                            <span>•</span>
                            <span>{patient.sex}, {patient.age}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white shadow-md rounded-xl h-11 px-6">
                        <Save className="w-4 h-4 mr-2" />
                        Save Record
                    </Button>
                </div>
            </header>

            {/* Main Layout Area */}
            <div className="flex-1 flex overflow-hidden w-full">

                {/* Left Sidebar Menu */}
                <aside className={cn(
                    "bg-white border-r border-slate-200 flex flex-col pt-6 shrink-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-72" : "w-20 items-center"
                )}>
                    <div className={cn("flex items-center mb-4 px-4", isSidebarOpen ? "justify-between" : "justify-center")}>
                        {isSidebarOpen && <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Charting Syllabus</h3>}
                        <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 h-auto text-slate-400 hover:text-slate-600 hover:bg-slate-100" title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
                        </Button>
                    </div>
                    <div className="flex-1 px-3 space-y-1 w-full">
                        {SECTIONS.map((sec, idx) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => setActiveSection(sec.id)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-3 rounded-xl text-left text-sm font-medium transition-all group",
                                        isSidebarOpen ? "justify-between" : "justify-center",
                                        isActive
                                            ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100"
                                            : "text-slate-600 hover:bg-slate-100 border border-transparent"
                                    )}
                                    title={sec.title}
                                >
                                    <span className={cn("flex items-center", isSidebarOpen ? "gap-3" : "justify-center")}>
                                        <span className={cn(
                                            "flex items-center justify-center shrink-0 w-6 h-6 rounded-full text-xs font-bold font-mono transition-colors",
                                            isActive ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500 group-hover:bg-slate-300"
                                        )}>
                                            {idx + 1}
                                        </span>
                                        {isSidebarOpen && <span className="truncate">{sec.title}</span>}
                                    </span>
                                    {isSidebarOpen && isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
                                </button>
                            )
                        })}
                    </div>
                </aside>

                {/* Dynamic Content Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 relative">

                    {/* 1. Images */}
                    {activeSection === 'images' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col max-w-5xl">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Images</h2>
                                    <p className="text-slate-500 mt-1">Upload and review patient radiographs and photos.</p>
                                </div>
                                <Button onClick={handleMockUpload} disabled={isUploading} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 px-6 font-medium shadow-sm">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isUploading ? 'Simulating...' : 'Simulate Upload'}
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {patientImages.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                                        <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                        <p>No images uploaded yet.</p>
                                    </div>
                                ) : (
                                    patientImages.map((img) => (
                                        <div key={img.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                                            <div className="aspect-square relative cursor-pointer bg-slate-100" onClick={() => setSelectedImage(img.url)}>
                                                <img src={img.url} alt={img.filename} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">View</span>
                                                </div>
                                            </div>
                                            <div className="p-3 flex items-center justify-between">
                                                <p className="text-xs font-semibold text-slate-800 truncate">{img.filename}</p>
                                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 shrink-0 h-8 w-8 p-0" onClick={() => removeImage(img.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <SectionNotes sectionId="images" formData={formData} updateField={updateField} />
                        </div>
                    )}

                    {/* 2. Patient History */}
                    {activeSection === 'patientHistory' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                            <div className="border-b border-slate-200 pb-4">
                                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-teal-600" />
                                    Patient History
                                </h2>
                                <p className="text-slate-500 mt-1">Please fill in the patient's medical and dental background.</p>
                            </div>

                            <div className="bg-linear-to-br from-white via-teal-50/30 to-cyan-50/30 rounded-2xl border border-teal-100 shadow-sm p-5 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Patient Name</p>
                                        <p className="text-sm font-bold text-slate-800">{patient.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sex / Age</p>
                                        <p className="text-sm font-bold text-slate-800">{patient.sex} / {patient.age}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">HN</p>
                                        <p className="text-sm font-bold text-slate-800">{patient.hn}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visit Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        'h-10 w-full justify-between rounded-xl border-slate-200 bg-white text-left font-semibold text-slate-700 hover:bg-slate-50 aria-expanded:bg-white aria-expanded:text-slate-700',
                                                        !visitDate && 'text-slate-400'
                                                    )}
                                                >
                                                    <span>{visitDate ? format(visitDate, 'PPP') : 'Select date'}</span>
                                                    <CalendarDays className="h-4 w-4 text-teal-600" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    selected={visitDate}
                                                    onSelect={setVisitDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                    <h3 className="font-semibold text-slate-800">Primary Concerns</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="chiefComplaint" className="text-sm font-bold text-slate-700">Chief Complaint</Label>
                                        <Textarea
                                            id="chiefComplaint"
                                            value={formData.chiefComplaint}
                                            onChange={e => updateField('chiefComplaint', e.target.value)}
                                            className="h-20 resize-none focus-visible:ring-teal-500"
                                            placeholder="Patient's primary reason for visiting..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="presentIllness" className="text-sm font-bold text-slate-700">Present Illness</Label>
                                        <Textarea
                                            id="presentIllness"
                                            value={formData.presentIllness}
                                            onChange={e => updateField('presentIllness', e.target.value)}
                                            className="h-24 resize-none focus-visible:ring-teal-500"
                                            placeholder="History and details of the present illness..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <HeartPulse className="w-5 h-5 text-teal-500" />
                                    <h3 className="font-semibold text-slate-800">Medical Information</h3>
                                </div>
                                <div className="p-6 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="medicalHistory" className="text-sm font-bold text-slate-700">Medical History</Label>
                                            <Textarea
                                                id="medicalHistory"
                                                value={formData.medicalHistory}
                                                onChange={e => updateField('medicalHistory', e.target.value)}
                                                className="h-20 resize-none focus-visible:ring-teal-500"
                                                placeholder="Systemic diseases, e.g., Diabetes, Hypertension"
                                            />
                                        </div>

                                        <div className="space-y-4 flex flex-col justify-center">
                                            <Label className="text-sm font-bold text-slate-700">Regular Doctor Visits?</Label>
                                            <ToggleButtonGroup
                                                value={formData.seeDoctorRegularly}
                                                onChange={(v) => {
                                                    updateField('seeDoctorRegularly', v);
                                                    if (v === 'no') {
                                                        updateField('regularDoctorMonths', '');
                                                        updateField('clinicName', '');
                                                    }
                                                }}
                                                options={[
                                                    { value: 'yes', label: 'Yes' },
                                                    { value: 'no', label: 'No' }
                                                ]}
                                                name="seeDoctorRegularly"
                                            />
                                            {formData.seeDoctorRegularly === 'yes' && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300 border-t border-slate-100 pt-4 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            value={formData.regularDoctorMonths}
                                                            onChange={e => updateField('regularDoctorMonths', e.target.value)}
                                                            className="w-24 h-9"
                                                            placeholder="0"
                                                            autoFocus
                                                        />
                                                        <span className="text-sm text-slate-500 font-medium">Months</span>
                                                    </div>
                                                    <Input
                                                        type="text"
                                                        value={formData.clinicName}
                                                        onChange={e => updateField('clinicName', e.target.value)}
                                                        className="focus-visible:ring-blue-500"
                                                        placeholder="e.g., Maharaj Hospital"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-bold text-slate-700">Current Medications</Label>
                                            {hasMedications !== null && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setHasMedications(null);
                                                        updateField('medications', []);
                                                    }}
                                                    className="text-xs text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                                                >
                                                    Reset Status
                                                </button>
                                            )}
                                        </div>

                                        {/* Status selector card if null */}
                                        {hasMedications === null ? (
                                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                                    <HeartPulse className="w-6 h-6 animate-pulse text-slate-500" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">Is the patient currently taking any medications?</p>
                                                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
                                                    Please indicate the patient's current medication status to continue.
                                                </p>
                                                <div className="flex gap-3 mt-5 w-full max-w-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setHasMedications(false);
                                                            updateField('medications', []);
                                                        }}
                                                        className="flex-1 min-h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    >
                                                        No Medications
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setHasMedications(true);
                                                        }}
                                                        className="flex-1 min-h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    >
                                                        Yes, Has Medications
                                                    </button>
                                                </div>
                                            </div>
                                        ) : hasMedications === false ? (
                                            /* Confirmed No Medications State */
                                            <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-5 flex items-center gap-3.5 animate-in fade-in duration-300">
                                                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-teal-800">Confirmed: No Current Medications</p>
                                                    <p className="text-xs text-teal-600 mt-0.5">The patient is currently not taking any clinical drugs or regular medication.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setHasMedications(true)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-200 bg-white hover:bg-slate-50 text-teal-700 shadow-sm transition-colors"
                                                >
                                                    Add Medication
                                                </button>
                                            </div>
                                        ) : (
                                            /* Yes, Has Medications Input Form State */
                                            <div className="space-y-5 p-5 border border-slate-100 bg-slate-50/30 rounded-2xl animate-in fade-in duration-300">
                                                {/* Medicine name input */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="medicineName" className="text-xs font-bold text-slate-700">Medicine Name</Label>
                                                    <Input
                                                        id="medicineName"
                                                        type="text"
                                                        className="focus-visible:ring-teal-500 bg-white"
                                                        placeholder="e.g., Paracetamol"
                                                        value={medFormInput.name}
                                                        onChange={(e) => setMedFormInput(prev => ({ ...prev, name: e.target.value }))}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter' && medFormInput.name.trim()) {
                                                                const newMed: Medication = {
                                                                    id: Date.now().toString(),
                                                                    name: medFormInput.name.trim(),
                                                                    dose: medFormInput.dose,
                                                                    frequency: medFormInput.frequency,
                                                                    dosePerTime: medFormInput.dosePerTime,
                                                                    timeOfDay: medFormInput.timeOfDay
                                                                };
                                                                updateField('medications', [...formData.medications, newMed]);
                                                                setMedFormInput({ name: '', dose: '', frequency: '', dosePerTime: '', timeOfDay: '' });
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                {/* Medication details grid */}
                                                <div className="grid grid-cols-4 gap-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="dose" className="text-xs font-bold text-slate-700">Dose</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                id="dose"
                                                                type="number"
                                                                className="focus-visible:ring-teal-500 bg-white flex-1"
                                                                placeholder="0"
                                                                value={medFormInput.dose}
                                                                onChange={(e) => setMedFormInput(prev => ({ ...prev, dose: e.target.value }))}
                                                            />
                                                            <span className="text-xs text-slate-500 min-w-fit">mg</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="frequency" className="text-xs font-bold text-slate-700">Frequency</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                id="frequency"
                                                                type="number"
                                                                className="focus-visible:ring-teal-500 bg-white flex-1"
                                                                placeholder="0"
                                                                value={medFormInput.frequency}
                                                                onChange={(e) => setMedFormInput(prev => ({ ...prev, frequency: e.target.value }))}
                                                            />
                                                            <span className="text-xs text-slate-500 min-w-fit">x/day</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="dosePerTime" className="text-xs font-bold text-slate-700">Per Time</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                id="dosePerTime"
                                                                type="number"
                                                                className="focus-visible:ring-teal-500 bg-white flex-1"
                                                                placeholder="0"
                                                                value={medFormInput.dosePerTime}
                                                                onChange={(e) => setMedFormInput(prev => ({ ...prev, dosePerTime: e.target.value }))}
                                                            />
                                                            <span className="text-xs text-slate-500 min-w-fit">mg</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="timeOfDay" className="text-xs font-bold text-slate-700">Time of Day</Label>
                                                        <Input
                                                            id="timeOfDay"
                                                            type="text"
                                                            className="focus-visible:ring-teal-500 bg-white"
                                                            placeholder="e.g., 08:00, 12:00"
                                                            value={medFormInput.timeOfDay}
                                                            onChange={(e) => setMedFormInput(prev => ({ ...prev, timeOfDay: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Add medication button */}
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (medFormInput.name.trim()) {
                                                            const newMed: Medication = {
                                                                id: Date.now().toString(),
                                                                name: medFormInput.name.trim(),
                                                                dose: medFormInput.dose,
                                                                frequency: medFormInput.frequency,
                                                                dosePerTime: medFormInput.dosePerTime,
                                                                timeOfDay: medFormInput.timeOfDay
                                                            };
                                                            updateField('medications', [...formData.medications, newMed]);
                                                            setMedFormInput({ name: '', dose: '', frequency: '', dosePerTime: '', timeOfDay: '' });
                                                        }
                                                    }}
                                                    className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto font-bold shadow-md hover:shadow-lg transition-all"
                                                    variant="default"
                                                >
                                                    + Add Medication
                                                </Button>

                                                {/* Empty state inside form if no meds added yet */}
                                                {formData.medications.length === 0 && (
                                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center animate-in fade-in duration-300">
                                                        <p className="text-xs font-bold text-slate-500">No medications added yet</p>
                                                        <p className="text-[11px] text-slate-400 mt-1">Please fill out the form above and click "+ Add Medication" to list them here.</p>
                                                    </div>
                                                )}

                                                {/* Medications summary table */}
                                                {formData.medications.length > 0 && (
                                                    <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                                        <table className="w-full">
                                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                                <tr>
                                                                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600">Name</th>
                                                                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600">Dose (mg)</th>
                                                                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600">Freq (x/day)</th>
                                                                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-600">Schedule</th>
                                                                    <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-600">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {formData.medications.map((med) => (
                                                                    <tr key={med.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                                        <td className="px-4 py-2.5 text-sm font-semibold text-slate-700">{med.name}</td>
                                                                        <td className="px-4 py-2.5 text-sm text-slate-600">{med.dose}</td>
                                                                        <td className="px-4 py-2.5 text-sm text-slate-600">{med.frequency}</td>
                                                                        <td className="px-4 py-2.5 text-sm text-slate-600">{med.timeOfDay}</td>
                                                                        <td className="px-4 py-2.5 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    updateField('medications', formData.medications.filter(m => m.id !== med.id));
                                                                                }}
                                                                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                                                                                title="Remove medication"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100 space-y-4">
                                        <Label className="text-sm font-bold text-slate-800">Known Allergies</Label>
                                        <ToggleButtonGroup
                                            value={formData.allergyStatus}
                                            onChange={(v) => {
                                                updateField('allergyStatus', v);
                                                if (v !== 'yes') updateField('allergyDetails', '');
                                            }}
                                            options={[
                                                { value: 'deny', label: 'Deny' },
                                                { value: 'unknown', label: "Don't know" },
                                                { value: 'yes', label: 'Yes, has allergies' }
                                            ]}
                                            name="allergyStatus"
                                        />

                                        {formData.allergyStatus === 'yes' && (
                                            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Input
                                                    id="allergyDetails"
                                                    value={formData.allergyDetails}
                                                    onChange={e => updateField('allergyDetails', e.target.value)}
                                                    className="border-rose-200 focus-visible:ring-rose-500 bg-white"
                                                    placeholder="Please specify allergic items (e.g., Penicillin, Latex, Seafood)..."
                                                    autoFocus
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-teal-600" />
                                    <h3 className="font-semibold text-slate-800">Dental Background & Expectations</h3>
                                </div>
                                <div className="p-6 space-y-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="dentalHistory" className="text-sm font-bold text-slate-700">Dental History</Label>
                                        <Textarea
                                            id="dentalHistory"
                                            value={formData.dentalHistory}
                                            onChange={e => updateField('dentalHistory', e.target.value)}
                                            className="h-20 resize-none focus-visible:ring-teal-500"
                                            placeholder="Previous dental treatments, periodontal history, etc."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="selfEvaluation" className="text-sm font-bold text-slate-700">Patient self evaluation of current dental/prostheses status <span className="text-slate-400 font-normal ml-1">(Optional)</span></Label>
                                        <Textarea
                                            id="selfEvaluation"
                                            value={formData.selfEvaluation}
                                            onChange={e => updateField('selfEvaluation', e.target.value)}
                                            className="h-20 resize-none focus-visible:ring-teal-500"
                                            placeholder="How does the patient feel about their current dental status?"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <RankedExpectationSelector
                                            selectedExpectations={formData.patientExpectation}
                                            onSelectionsChange={(selections) => updateField('patientExpectation', selections)}
                                            otherValue={formData.otherExpectation}
                                            onOtherChange={(value) => updateField('otherExpectation', value)}
                                        />
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <Label htmlFor="expectedOutcomeDetail" className="text-sm font-bold text-slate-700">Patient expected detail of outcome</Label>
                                        <Textarea
                                            id="expectedOutcomeDetail"
                                            value={formData.expectedOutcomeDetail}
                                            onChange={e => updateField('expectedOutcomeDetail', e.target.value)}
                                            className="h-24 resize-none focus-visible:ring-teal-500"
                                            placeholder="Specific details on what the patient hopes to achieve from the treatment..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Edentulous History Section */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-800">Edentulous History</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="edentulousTime" className="text-sm font-bold text-slate-700">Length of time edentulous</Label>
                                        <Input
                                            id="edentulousTime"
                                            value={formData.edentulousTime}
                                            onChange={e => updateField('edentulousTime', e.target.value)}
                                            className="focus-visible:ring-teal-500"
                                            placeholder="e.g., 5 months, 2 years"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="previousDentureCount" className="text-sm font-bold text-slate-700">Number of previous denture</Label>
                                        <Input
                                            id="previousDentureCount"
                                            value={formData.previousDentureCount}
                                            onChange={e => updateField('previousDentureCount', e.target.value)}
                                            className="focus-visible:ring-teal-500"
                                            placeholder="e.g., 1, None"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="presentDentureAge" className="text-sm font-bold text-slate-700">Age of present denture</Label>
                                        <Input
                                            id="presentDentureAge"
                                            value={formData.presentDentureAge}
                                            onChange={e => updateField('presentDentureAge', e.target.value)}
                                            className="focus-visible:ring-teal-500"
                                            placeholder="e.g., 3 years, N/A"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="dentureComplaint" className="text-sm font-bold text-slate-700">Nature of complaint</Label>
                                        <Input
                                            id="dentureComplaint"
                                            value={formData.dentureComplaint}
                                            onChange={e => updateField('dentureComplaint', e.target.value)}
                                            className="focus-visible:ring-teal-500"
                                            placeholder="e.g., Loose, hurts when chewing"
                                        />
                                    </div>
                                </div>
                            </div>
                            <SectionNotes sectionId="patientHistory" formData={formData} updateField={updateField} />
                        </div>
                    )}

                    {/* 3. Extraoral examination */}
                    {activeSection === 'extraoral' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                            <div className="border-b border-slate-200 pb-4">
                                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                    <UserSquare2 className="w-8 h-8 text-teal-600" />
                                    Extraoral Examination
                                </h2>
                                <p className="text-slate-500 mt-1">Facial symmetry, TMJ, muscle pain, and habits assessment.</p>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-800">Facial Appearance</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-10">
                                    <div className="space-y-3">
                                        <FacialSymmetry
                                            value={formData.facialSymmetry}
                                            onChange={(val) => updateField('facialSymmetry', val)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <FacialProfile
                                            value={formData.facialProfile}
                                            onChange={(val) => updateField('facialProfile', val)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-teal-500" />
                                    <h3 className="font-semibold text-slate-800">Muscles & TMJ Assessment</h3>
                                </div>

                                <div className="p-6 space-y-10">
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-slate-700 mb-4 block">Muscle Pain <span className="text-slate-400 font-normal ml-1">(Click on the face chart)</span></Label>
                                        <FaceMuscleChart
                                            selectedMuscles={formData.musclePain}
                                            onToggleMuscle={(id) => toggleArrayField('musclePain', id)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Present Joint Pain</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Function', 'Palpation'].map(opt => (
                                                    <div
                                                        key={opt}
                                                        onClick={() => toggleArrayField('jointPain', opt)}
                                                        className={cn(
                                                            "px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-semibold select-none",
                                                            formData.jointPain.includes(opt)
                                                                ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Jaw Deviation</Label>
                                            <div className="flex flex-col gap-3">
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[{ label: 'None', value: 'none' }, { label: 'Left', value: 'to the left' }, { label: 'Right', value: 'to the right' }].map(opt => (
                                                        <div
                                                            key={opt.value}
                                                            onClick={() => {
                                                                updateField('jawDeviation', opt.value);
                                                                if (opt.value === 'none') updateField('jawDeviationMm', '');
                                                            }}
                                                            className={cn(
                                                                "px-3 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-semibold select-none whitespace-nowrap",
                                                                formData.jawDeviation === opt.value
                                                                    ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                                {(formData.jawDeviation === 'to the left' || formData.jawDeviation === 'to the right') && (
                                                    <div className="relative w-full animate-in fade-in zoom-in duration-200">
                                                        <Input
                                                            type="number"
                                                            placeholder="e.g. 2"
                                                            className="w-full h-12 rounded-xl border-slate-200 pr-10"
                                                            value={formData.jawDeviationMm}
                                                            onChange={e => updateField('jawDeviationMm', e.target.value)}
                                                            autoFocus
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3 md:col-span-2">
                                            <Label className="text-sm font-bold text-slate-700">Joint Sound</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {['No', 'Clicking', 'Crepitus', 'Popping'].map(opt => (
                                                    <div
                                                        key={opt}
                                                        onClick={() => updateField('jointSound', opt.toLowerCase())}
                                                        className={cn(
                                                            "px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-semibold select-none",
                                                            formData.jointSound === opt.toLowerCase()
                                                                ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                                        <div className="space-y-4">
                                            <Label className="text-sm font-bold text-slate-700">Maximum Mouth Opening (mm)</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex-1">
                                                    <Input
                                                        type="number"
                                                        value={formData.openingMm}
                                                        onChange={(e) => updateField('openingMm', e.target.value)}
                                                        className="w-full pr-10 border-slate-200"
                                                        placeholder="e.g. 40"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                                </div>
                                                {Number(formData.openingMm) > 0 && Number(formData.openingMm) < 35 && (
                                                    <span className="text-sm text-rose-500 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 shrink-0">Limited opening</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-sm font-bold text-slate-700">Limited Border Movement?</Label>
                                            <ToggleButtonGroup
                                                value={formData.limitedBorder}
                                                onChange={(v) => { updateField('limitedBorder', v); if (v === 'no') updateField('borderDetail', ''); }}
                                                options={[
                                                    { value: 'no', label: 'No' },
                                                    { value: 'yes', label: 'Yes' }
                                                ]}
                                                name="limitedBorder"
                                            />

                                            {formData.limitedBorder === 'yes' && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <Input
                                                        value={formData.borderDetail}
                                                        onChange={e => updateField('borderDetail', e.target.value)}
                                                        className="bg-white border-rose-200 focus-visible:ring-rose-500"
                                                        placeholder="Specify details..."
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-semibold text-slate-800">Habits & Factors Affecting Tooth Wear</h3>
                                </div>

                                <div className="p-6 space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-700">Parafunctional Habit <span className="text-slate-400 font-normal ml-1">(Multi-select)</span></Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Nail biting', 'Bruxism', 'Clenching', 'Tongue thrust', 'Other'].map(opt => (
                                                <div
                                                    key={opt}
                                                    onClick={() => toggleArrayField('parafunctionalHabits', opt)}
                                                    className={cn(
                                                        "px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-semibold select-none",
                                                        formData.parafunctionalHabits.includes(opt)
                                                            ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>

                                        {formData.parafunctionalHabits.includes('Other') && (
                                            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Input
                                                    value={formData.habitOther}
                                                    onChange={e => updateField('habitOther', e.target.value)}
                                                    className="focus-visible:ring-amber-500 border-amber-200"
                                                    placeholder="Specify other parafunctional habit..."
                                                    autoFocus
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 border-t border-slate-100 pt-6">
                                        <Label className="text-sm font-bold text-slate-700">Factors Affecting Tooth Wear <span className="text-slate-400 font-normal ml-1">(Multi-select)</span></Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {['Hard food', 'Acid Beverage', 'Bulimia', 'Swimming', 'GERD', 'Other'].map(opt => (
                                                <div
                                                    key={opt}
                                                    onClick={() => toggleArrayField('toothWearFactors', opt)}
                                                    className={cn(
                                                        "px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center text-sm font-semibold select-none",
                                                        formData.toothWearFactors.includes(opt)
                                                            ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>

                                        {(formData.toothWearFactors.includes('Hard food') || formData.toothWearFactors.includes('Other')) && (
                                            <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                {formData.toothWearFactors.includes('Hard food') && (
                                                    <Input
                                                        value={formData.wearHardFoodDetail}
                                                        onChange={e => updateField('wearHardFoodDetail', e.target.value)}
                                                        className="focus-visible:ring-amber-500 border-amber-200"
                                                        placeholder="Specify hard food type..."
                                                        autoFocus
                                                    />
                                                )}
                                                {formData.toothWearFactors.includes('Other') && (
                                                    <Input
                                                        value={formData.wearOtherDetail}
                                                        onChange={e => updateField('wearOtherDetail', e.target.value)}
                                                        className="focus-visible:ring-amber-500 border-amber-200"
                                                        placeholder="Specify other tooth wear factors..."
                                                        autoFocus
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <SectionNotes sectionId="extraoral" formData={formData} updateField={updateField} />
                        </div>
                    )}

                    {/* 5. Esthetic evaluation */}
                    {activeSection === 'esthetic' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                            <div className="border-b border-slate-200 pb-4">
                                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 text-teal-600" />
                                    Esthetic Evaluation
                                </h2>
                                <p className="text-slate-500 mt-1">Facial analysis, smile line, and phonetic assessment.</p>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <ScanFace className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-800">1. Facial Analysis</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 md:col-span-2">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Occlusal plane to interpupillary line
                                        </Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <VisualCard id="parallel" label="Parallel" imagePath="/Plane/pararell.png" isSelected={formData.occlusalPlane === 'parallel'} onClick={() => updateField('occlusalPlane', 'parallel')} iconClassName="w-full aspect-square object-cover" />
                                            <VisualCard id="canted-right" label="Canted Right" imagePath="/Plane/right.png" isSelected={formData.occlusalPlane === 'canted-right'} onClick={() => updateField('occlusalPlane', 'canted-right')} iconClassName="w-full aspect-square object-cover" />
                                            <VisualCard id="canted-left" label="Canted Left" imagePath="/Plane/left.png" isSelected={formData.occlusalPlane === 'canted-left'} onClick={() => updateField('occlusalPlane', 'canted-left')} iconClassName="w-full aspect-square object-cover" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Nasolabial Angle
                                        </Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <VisualCard id="90" label="Normal (~90°)" imagePath="/Nasolabial Angle/90.png" isSelected={formData.nasolabialAngle === '90'} onClick={() => updateField('nasolabialAngle', '90')} iconClassName="w-full aspect-square object-cover" />
                                            <VisualCard id="<90" label="Prominent (<90°)" imagePath="/Nasolabial Angle/70.png" isSelected={formData.nasolabialAngle === '<90'} onClick={() => updateField('nasolabialAngle', '<90')} iconClassName="w-full aspect-square object-cover" />
                                            <VisualCard id=">90" label="Retruded (>90°)" imagePath="/Nasolabial Angle/100.png" isSelected={formData.nasolabialAngle === '>90'} onClick={() => updateField('nasolabialAngle', '>90')} iconClassName="w-full aspect-square object-cover" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:col-span-2 border-t border-slate-100 pt-6">
                                        <Label className="text-sm font-bold text-slate-700">Facial midline and dental midline discrepancy</Label>
                                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                            <div className="grid grid-cols-3 gap-2 flex-1 w-full">
                                                {[
                                                    { id: 'symmetric', label: 'Symmetric' },
                                                    { id: 'right', label: 'Right Shift' },
                                                    { id: 'left', label: 'Left Shift' }
                                                ].map(opt => (
                                                    <TextCard
                                                        key={opt.id}
                                                        label={opt.label}
                                                        isSelected={formData.facialMidline === opt.id}
                                                        onClick={() => {
                                                            updateField('facialMidline', opt.id);
                                                            if (opt.id === 'symmetric') updateField('facialMidlineMm', '');
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            {formData.facialMidline !== 'symmetric' && (
                                                <div className="relative w-full mt-3 animate-in fade-in zoom-in-95 duration-200">
                                                    <Input
                                                        type="number"
                                                        value={formData.facialMidlineMm}
                                                        onChange={(e) => updateField('facialMidlineMm', e.target.value)}
                                                        className="w-full pr-10 border-slate-200"
                                                        placeholder="e.g. 2"
                                                        autoFocus
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.4 0-8-3.6-8-8 0-2.8 1.5-5.3 3.8-6.7C8.5 5.5 10.2 5 12 5s3.5.5 4.2 1.3C18.5 7.7 20 10.2 20 13c0 4.4-3.6 8-8 8z" /><path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                                    <h3 className="font-semibold text-slate-800">2. Lip at Rest</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-8">
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6">
                                        <div className="w-full sm:w-1/3 shrink-0">
                                            <img
                                                src="/LipLenght.png"
                                                alt="Lip length measurement guide"
                                                className="w-full h-auto rounded-lg object-contain bg-white border border-slate-100 shadow-sm"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2 text-center sm:text-left">
                                            <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Lip Measurement Guide</Label>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Measure from <b>subnasale</b> (base of nose) to <b>stomion</b> (bottom edge of upper lip). Record in millimeters.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Lip Fullness</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['Full', 'Average', 'Thin'].map(opt => (
                                                        <TextCard key={opt} label={opt} isSelected={formData.lipFullness === opt.toLowerCase()} onClick={() => updateField('lipFullness', opt.toLowerCase())} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Lip Length</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['Long', 'Average', 'Short'].map(opt => (
                                                        <TextCard key={opt} label={opt} isSelected={formData.lipLength === opt.toLowerCase()} onClick={() => updateField('lipLength', opt.toLowerCase())} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 md:border-l md:border-slate-100 md:pl-8">
                                            <Label className="text-sm font-bold text-slate-700">Tooth Exposure at Rest</Label>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-16 text-sm font-semibold text-slate-500">Upper</span>
                                                    <div className="relative flex-1">
                                                        <Input
                                                            type="number"
                                                            value={formData.toothExpUpper}
                                                            onChange={(e) => updateField('toothExpUpper', e.target.value)}
                                                            className="w-full border-slate-200 pr-10"
                                                            placeholder="e.g. 2"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="w-16 text-sm font-semibold text-slate-500">Lower</span>
                                                    <div className="relative flex-1">
                                                        <Input
                                                            type="number"
                                                            value={formData.toothExpLower}
                                                            onChange={(e) => updateField('toothExpLower', e.target.value)}
                                                            className="w-full border-slate-200 pr-10"
                                                            placeholder="e.g. 2"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Section 3: Dentofacial Analysis --- */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Smile className="w-5 h-5 text-teal-500" />
                                    <h3 className="font-semibold text-slate-800">3. Dentofacial Analysis</h3>
                                </div>

                                <div className="p-6 lg:p-10 space-y-10">

                                    {/* Smile Line */}
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Smile Line
                                        </Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <VisualCard id="average" label="Average" imagePath="/Dentofacial Analysis/avg.png" isSelected={formData.smileLine === 'average'} onClick={() => updateField('smileLine', 'average')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="high" label="High" imagePath="/Dentofacial Analysis/high.png" isSelected={formData.smileLine === 'high'} onClick={() => updateField('smileLine', 'high')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="low" label="Low" imagePath="/Dentofacial Analysis/Low.png" isSelected={formData.smileLine === 'low'} onClick={() => updateField('smileLine', 'low')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                        </div>
                                    </div>

                                    {/* Incisal Silhouette */}
                                    <div className="space-y-4 pt-10 border-t border-slate-100">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Incisal Silhouette
                                        </Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <VisualCard id="convex" label="Convex Curve" imagePath="/Dentofacial Analysis/ConvexCurve.jpeg" isSelected={formData.incisalCurve === 'convex'} onClick={() => updateField('incisalCurve', 'convex')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="straight" label="Straight" imagePath="/Dentofacial Analysis/Straight.jpeg" isSelected={formData.incisalCurve === 'straight'} onClick={() => updateField('incisalCurve', 'straight')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="reverse" label="Reverse" imagePath="/Dentofacial Analysis/Reverse.jpeg" isSelected={formData.incisalCurve === 'reverse'} onClick={() => updateField('incisalCurve', 'reverse')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                        </div>
                                    </div>

                                    {/* Midline (Philtrum) */}
                                    <div className="space-y-4 pt-10 border-t border-slate-100">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Midline (Philtrum)
                                        </Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <VisualCard id="center" label="Center" imagePath="/Dentofacial Analysis/center.jpeg" isSelected={formData.midlinePhiltrum === 'center'} onClick={() => updateField('midlinePhiltrum', 'center')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="right" label="Right" imagePath="/Dentofacial Analysis/Right of center.jpeg" isSelected={formData.midlinePhiltrum === 'right'} onClick={() => updateField('midlinePhiltrum', 'right')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="left" label="Left" imagePath="/Dentofacial Analysis/Left of center.jpeg" isSelected={formData.midlinePhiltrum === 'left'} onClick={() => updateField('midlinePhiltrum', 'left')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                        </div>
                                    </div>

                                    {/* Teeth Exposed (Full Smile) */}
                                    <div className="space-y-4 pt-10 border-t border-slate-100">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Teeth Exposed (Full Smile)
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <VisualCard id="6" label="6 Teeth" imagePath="/Dentofacial Analysis/6.jpeg" isSelected={formData.teethExposed === '6'} onClick={() => updateField('teethExposed', '6')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="8" label="8 Teeth" imagePath="/Dentofacial Analysis/8.jpeg" isSelected={formData.teethExposed === '8'} onClick={() => updateField('teethExposed', '8')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="10" label="10 Teeth" imagePath="/Dentofacial Analysis/10.jpeg" isSelected={formData.teethExposed === '10'} onClick={() => updateField('teethExposed', '10')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="16" label="16 Teeth" imagePath="/Dentofacial Analysis/16.jpeg" isSelected={formData.teethExposed === '16'} onClick={() => updateField('teethExposed', '16')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                        </div>
                                    </div>

                                    {/* Tooth-Lower Lip Position */}
                                    <div className="space-y-4 pt-10 border-t border-slate-100">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Tooth-Lower Lip Position
                                        </Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <VisualCard id="touching" label="Touching" imagePath="/Dentofacial Analysis/Touching.jpeg" isSelected={formData.lipPosition === 'touching'} onClick={() => updateField('lipPosition', 'touching')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="not-touching" label="Not Touching" imagePath="/Dentofacial Analysis/Not touching.jpeg" isSelected={formData.lipPosition === 'not-touching'} onClick={() => updateField('lipPosition', 'not-touching')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="slightly-covered" label="Covered" imagePath="/Dentofacial Analysis/Slightly coverage.jpeg" isSelected={formData.lipPosition === 'slightly-covered'} onClick={() => updateField('lipPosition', 'slightly-covered')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                        </div>
                                    </div>

                                    {/* Upper & Lower Midline */}
                                    <div className="space-y-4 pt-10 border-t border-slate-100">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Upper & Lower Midline
                                        </Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <VisualCard id="right" label="Right" imagePath="/Dentofacial Analysis/Right.jpeg" isSelected={formData.midlineIncisors === 'right'} onClick={() => updateField('midlineIncisors', 'right')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="left" label="Left" imagePath="/Dentofacial Analysis/Left.jpeg" isSelected={formData.midlineIncisors === 'left'} onClick={() => updateField('midlineIncisors', 'left')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                            <VisualCard id="straight" label="Straight" imagePath="/Dentofacial Analysis/Stright midline.jpeg" isSelected={formData.midlineIncisors === 'straight'} onClick={() => updateField('midlineIncisors', 'straight')} iconClassName="w-full h-24 sm:h-28 object-contain" />
                                        </div>
                                    </div>

                                    {/* Buccal Corridor */}
                                    <div className="space-y-4 pt-10 border-t border-slate-100">
                                        <Label className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Buccal Corridor
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                                            <VisualCard id="normal" label="Normal" imagePath="/Dentofacial Analysis/Normal corridor.jpeg" isSelected={formData.buccalCorridor === 'normal'} onClick={() => updateField('buccalCorridor', 'normal')} iconClassName="w-full h-32 sm:h-40 object-contain p-2" />
                                            <VisualCard id="increased" label="Increased" imagePath="/Dentofacial Analysis/Increased.jpeg" isSelected={formData.buccalCorridor === 'increased'} onClick={() => updateField('buccalCorridor', 'increased')} iconClassName="w-full h-32 sm:h-40 object-contain p-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Mic2 className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-semibold text-slate-800">4. Phonetics</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-base font-bold text-slate-800">F-V Sound</Label>
                                            <span className="text-sm text-slate-500">Incisal edge of maxillary centrals on wet/dry line of lower lip?</span>
                                        </div>
                                        <ToggleButtonGroup
                                            value={formData.fvSound}
                                            onChange={(v) => updateField('fvSound', v)}
                                            options={[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' }
                                            ]}
                                            name="fvSound"
                                        />
                                    </div>

                                    <div className="space-y-4 md:border-l md:border-slate-100 md:pl-8">
                                        <Label className="text-base font-bold text-slate-800">Closest speaking space (S Sound)</Label>
                                        <div className="space-y-4 pt-1">
                                            <div className="relative w-full">
                                                <Input
                                                    type="number"
                                                    value={formData.sSoundMm}
                                                    onChange={(e) => updateField('sSoundMm', e.target.value)}
                                                    className="pr-10 border-slate-200 focus-visible:ring-amber-500"
                                                    placeholder="e.g. 2"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 uppercase">Reference Teeth</Label>
                                                <Input value={formData.sSoundRef} onChange={e => updateField('sSoundRef', e.target.value)} className="bg-white focus-visible:ring-amber-500" placeholder="e.g., 11, 21, 31, 41" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SectionNotes sectionId="esthetic" formData={formData} updateField={updateField} />
                        </div>
                    )}

                    {/* 6. VDO evaluations */}
                    {activeSection === 'vdo' && (
                        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                            <div className="border-b border-slate-200 pb-4">
                                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                    <Ruler className="w-8 h-8 text-teal-600" />
                                    VDO Evaluations
                                </h2>
                                <p className="text-slate-500 mt-1">Vertical Dimension of Occlusion analysis and soft tissue assessment.</p>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <UserMinus className="w-5 h-5 text-pink-500" />
                                    <h3 className="font-semibold text-slate-800">Facial Soft Tissue Contour</h3>
                                </div>
                                <div className="p-6">
                                    <Label className="text-sm font-bold text-slate-700 mb-3 block">
                                        Select present conditions <span className="text-slate-400 font-normal ml-1">(Multi-select)</span>
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { id: 'nasolabial-fold', label: 'Nasolabial fold' },
                                            { id: 'prominent-chin', label: 'Prominent chin' },
                                            { id: 'drooping-commissure', label: 'Drooping commissure' },
                                            { id: 'thin-lips', label: 'Thin lips' }
                                        ].map(opt => (
                                            <SelectCard
                                                key={opt.id}
                                                label={opt.label}
                                                isSelected={formData.vdoSoftTissueContour.includes(opt.id)}
                                                onClick={() => toggleArrayField('vdoSoftTissueContour', opt.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Focus className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-800">Functional & Bite Assessment</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-slate-700">Closest Speaking Space</Label>
                                        <div className="space-y-4 pt-1">
                                            <div className="relative w-full">
                                                <Input
                                                    type="number"
                                                    value={formData.closestSpeakingSpace}
                                                    onChange={(e) => updateField('closestSpeakingSpace', e.target.value)}
                                                    className="pr-10 border-slate-200 focus-visible:ring-teal-500"
                                                    placeholder="e.g. 2"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 uppercase">Reference Teeth</Label>
                                                <Input
                                                    value={formData.vdoSpeakingSpaceRef}
                                                    onChange={e => updateField('vdoSpeakingSpaceRef', e.target.value)}
                                                    className="bg-white focus-visible:ring-teal-500"
                                                    placeholder="e.g., 11, 41"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:border-l md:border-slate-100 md:pl-8">
                                        <Label className="text-sm font-bold text-slate-700">Present Bite Type</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'normal', label: 'Normal bite' },
                                                { id: 'deep', label: 'Deep bite' },
                                                { id: 'edge', label: 'Edge to edge' },
                                                { id: 'crossbite', label: 'Crossbite' }
                                            ].map(opt => (
                                                <SelectCard
                                                    key={opt.id}
                                                    label={opt.label}
                                                    isSelected={formData.vdoBiteType === opt.id}
                                                    onClick={() => updateField('vdoBiteType', opt.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">

                                    <div className="space-y-2 w-full md:w-1/2">
                                        <Label className="text-sm font-bold text-slate-700">Free-way space (VDO - VDR)</Label>
                                        <div className="relative w-full">
                                            <Input
                                                type="number"
                                                value={formData.vdoFreewaySpaceMm}
                                                onChange={(e) => {
                                                    updateField('vdoFreewaySpaceMm', e.target.value);
                                                    updateField('freewaySpace', e.target.value);
                                                }}
                                                className="pr-10 border-slate-200"
                                                placeholder="e.g. 2"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">mm</span>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 h-full flex items-center">
                                        {isVdoLost ? (
                                            <div className="animate-in zoom-in-95 fade-in duration-300 w-full flex items-start gap-3 bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-700">
                                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-sm">Loss of VDO Indicated</h4>
                                                    <p className="text-xs text-rose-600/80 mt-0.5">A free-way space greater than 4mm suggests a loss of Vertical Dimension.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm">
                                                Expected normal range is ≤ 4mm
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                            <SectionNotes sectionId="vdo" formData={formData} updateField={updateField} />
                        </div>
                    )}

                    {/* 7. Dental status */}
                    {activeSection === 'dentalStatus' && (
                        <div className="h-full w-full flex flex-col gap-4 animate-in fade-in duration-300 max-w-none">
                            <div className="flex items-center justify-end">
                                <Button
                                    type="button"
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-4 font-semibold shadow-sm"
                                >
                                    AI Analysis (coming soon)
                                </Button>
                            </div>
                            {/* Bottom Side: Medical Status */}
                            <div className="flex-1 w-full overflow-visible min-h-125">
                                <OdontogramUI />
                            </div>
                        </div>
                    )}

                    {/* 8. Occlusal analysis */}
                    {activeSection === 'occlusal' && (
                        <div className="flex flex-col space-y-8 pb-12">
                            <OcclusalAnalysis />
                            <div className="max-w-7xl mx-auto w-full px-4">
                                <SectionNotes sectionId="occlusal" formData={formData} updateField={updateField} />
                            </div>
                        </div>
                    )}

                    {/* 9. Residual ridge area */}
                    {activeSection === 'residualRidge' && (
                        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                            <div className="border-b border-slate-200 pb-4">
                                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                    <Layers className="w-8 h-8 text-emerald-600" />
                                    Residual Ridge Area
                                </h2>
                                <p className="text-slate-500 mt-1">Comprehensive evaluation of the edentulous ridge, soft tissues, and patient attitude.</p>
                            </div>

                            {/* 1. Arch & Ridge Morphology */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Maximize className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-800">1. Arch & Ridge Morphology</h3>
                                </div>

                                <div className="p-6 md:p-8 space-y-8">
                                    {/* Top Area: Height, Width, Jaw Size as horizontal grids aligned in rows */}
                                    <div className="grid grid-cols-1 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                            <Label className="text-sm font-bold text-slate-700">Ridge Height</Label>
                                            <div className="grid grid-cols-3 gap-2 md:col-span-3">
                                                {['High', 'Low (flat)', 'Knife edge'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.ridgeHeight === opt} onClick={() => updateField('ridgeHeight', opt)} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-slate-100 pt-6">
                                            <Label className="text-sm font-bold text-slate-700">Ridge Width</Label>
                                            <div className="grid grid-cols-2 gap-2 md:col-span-3">
                                                {['Round', 'Narrow'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.ridgeWidth === opt} onClick={() => updateField('ridgeWidth', opt)} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-slate-100 pt-6">
                                            <Label className="text-sm font-bold text-slate-700">Size of Jaw</Label>
                                            <div className="grid grid-cols-3 gap-2 md:col-span-3">
                                                {['Small', 'Medium', 'Large'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.jawSize === opt} onClick={() => updateField('jawSize', opt)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Area: Ridge Shape */}
                                    <div className="space-y-4 border-t border-slate-100 pt-6">
                                        <Label className="text-sm font-bold text-slate-700">Ridge Shape</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Upper Arch (U)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['U shape', 'V shape', 'Undercut', 'Flat'].map(opt => (
                                                        <SelectCard key={`u-${opt}`} label={opt} isSelected={formData.ridgeShapeU === opt} onClick={() => updateField('ridgeShapeU', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Lower Arch (L)</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['U shape', 'V shape', 'Undercut', 'Flat'].map(opt => (
                                                        <SelectCard key={`l-${opt}`} label={opt} isSelected={formData.ridgeShapeL === opt} onClick={() => updateField('ridgeShapeL', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Area: Perfectly Symmetrical 2-Column layout for grids */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Ridge Relation</Label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {['Class I', 'Class II', 'Class III', 'Crossbite'].map(opt => (
                                                        <SelectCard key={opt} label={opt} isSelected={formData.ridgeRelation === opt} onClick={() => updateField('ridgeRelation', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Ridge Parallelism</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Parallel', 'Divergent'].map(opt => (
                                                        <SelectCard key={opt} label={opt} isSelected={formData.ridgeParallelism === opt} onClick={() => updateField('ridgeParallelism', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Interridge Space</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Sufficient', 'Insufficient'].map(opt => (
                                                        <SelectCard key={opt} label={opt} isSelected={formData.interridgeSpace === opt} onClick={() => updateField('interridgeSpace', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Lower Arch Form</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['Square', 'Taper', 'Ovoid'].map(opt => (
                                                        <SelectCard key={opt} label={opt} isSelected={formData.lowerArchForm === opt} onClick={() => updateField('lowerArchForm', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Palatal & Throat Morphology */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Focus className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-semibold text-slate-800">2. Palatal & Throat Morphology</h3>
                                </div>

                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        <Label className="text-sm font-bold text-slate-700">Palatal Vault</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:col-span-3">
                                            {['Average', 'Steep', 'V shape', 'Shallow'].map(opt => (
                                                <SelectCard key={opt} label={opt} isSelected={formData.palatalVault === opt} onClick={() => updateField('palatalVault', opt)} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-slate-100 pt-6">
                                        <Label className="text-sm font-bold text-slate-700">Palatal Throat Form</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:col-span-3">
                                            {[
                                                { id: 'class-i', label: 'Class I', subLabel: '5-13mm of PSS band' },
                                                { id: 'class-ii', label: 'Class II', subLabel: '3-5mm of PSS band' },
                                                { id: 'class-iii', label: 'Class III', subLabel: '<3mm of PSS band' }
                                            ].map(opt => (
                                                <SelectCard key={opt.id} label={opt.label} subLabel={opt.subLabel} isSelected={formData.palatalThroatForm === opt.id} onClick={() => updateField('palatalThroatForm', opt.id)} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Anomalies & Attachments */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden border-l-4 border-l-rose-500">
                                <div className="bg-rose-50/50 border-b border-rose-100 px-6 py-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                    <h3 className="font-semibold text-rose-900">3. Anomalies & Attachments</h3>
                                </div>

                                <div className="p-6 md:p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column: Torus Present & Ridge Deformity */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Torus Present <span className="text-slate-400 font-normal ml-1">(Multi-select)</span></Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Palatinus', 'Mandibularis'].map(opt => (
                                                        <SelectCard key={opt} label={opt} type="checkbox" isSelected={formData.torusPresent.includes(opt)} onClick={() => toggleArrayField('torusPresent', opt)} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700">Ridge Deformity <span className="text-slate-400 font-normal ml-1">(Multi-select)</span></Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Exostosis', 'Bony spicule', 'Flabby tissue', 'Knife edge'].map(opt => (
                                                        <SelectCard key={opt} label={opt} type="checkbox" isSelected={formData.ridgeDeformity.includes(opt)} onClick={() => toggleArrayField('ridgeDeformity', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: High Frenum Attachment */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">High Frenum Attachment <span className="text-slate-400 font-normal ml-1">(Multi-select)</span></Label>
                                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 h-[calc(100%-2rem)]">
                                                <div className="space-y-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Upper (U)</span>
                                                    {['Labial', 'Buccal L/R'].map(opt => (
                                                        <SelectCard key={`u-${opt}`} label={opt} type="checkbox" isSelected={formData.frenumU.includes(opt)} onClick={() => toggleArrayField('frenumU', opt)} />
                                                    ))}
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Lower (L)</span>
                                                    {['Labial', 'Buccal L/R'].map(opt => (
                                                        <SelectCard key={`l-${opt}`} label={opt} type="checkbox" isSelected={formData.frenumL.includes(opt)} onClick={() => toggleArrayField('frenumL', opt)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {(formData.ridgeDeformity.includes('Exostosis') || formData.ridgeDeformity.includes('Bony spicule')) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                                            {formData.ridgeDeformity.includes('Exostosis') && (
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-rose-500 uppercase tracking-wider">Exostosis Details</Label>
                                                    <Input
                                                        value={formData.exostosisDetail}
                                                        onChange={e => updateField('exostosisDetail', e.target.value)}
                                                        className="border-rose-200 focus-visible:ring-rose-500"
                                                        placeholder="Specify location/details..."
                                                    />
                                                </div>
                                            )}
                                            {formData.ridgeDeformity.includes('Bony spicule') && (
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-rose-500 uppercase tracking-wider">Bony Spicule Details</Label>
                                                    <Input
                                                        value={formData.bonySpiculeDetail}
                                                        onChange={e => updateField('bonySpiculeDetail', e.target.value)}
                                                        className="border-rose-200 focus-visible:ring-rose-500"
                                                        placeholder="Specify location..."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4. Soft Tissue & Environment */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Droplets className="w-5 h-5 text-sky-500" />
                                    <h3 className="font-semibold text-slate-800">4. Soft Tissue & Environment</h3>
                                </div>

                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Column 1: Tongue Size, Tongue Position, Lip Mobility */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Tongue Size</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Small', 'Medium', 'Large'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.tongueSize === opt} onClick={() => updateField('tongueSize', opt)} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Tongue Position</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Normal', 'Retracted'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.tonguePosition === opt} onClick={() => updateField('tonguePosition', opt)} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Lip Mobility</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Normal', 'Highly active', 'Relatively inactive'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.lipMobility === opt} onClick={() => updateField('lipMobility', opt)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Facial Muscle Tone, Saliva Assessment */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Facial Muscle Tone</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Tense', 'Average', 'Flaccid'].map(opt => (
                                                    <SelectCard key={opt} label={opt} isSelected={formData.facialMuscleTone === opt.toLowerCase()} onClick={() => updateField('facialMuscleTone', opt.toLowerCase())} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-700">Saliva Assessment</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <SelectCard label="Normal Vol." isSelected={formData.amountOfSaliva === 'Normal'} onClick={() => updateField('amountOfSaliva', 'Normal')} />
                                                <SelectCard label="Xerostomia" isSelected={formData.amountOfSaliva === 'Xerostomia'} onClick={() => updateField('amountOfSaliva', 'Xerostomia')} />
                                                <SelectCard label="Thick" isSelected={formData.salivaConsistency === 'thick'} onClick={() => updateField('salivaConsistency', 'thick')} />
                                                <SelectCard label="Thin" isSelected={formData.salivaConsistency === 'thin'} onClick={() => updateField('salivaConsistency', 'thin')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Mental Attitude */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-teal-600" />
                                    <h3 className="font-semibold text-slate-800">5. Mental Attitude</h3>
                                </div>

                                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-full md:w-1/3 space-y-1">
                                        <h4 className="font-bold text-slate-800">M.M. House Classification</h4>
                                        <p className="text-xs text-slate-500">Evaluation of the patient's psychological state and cooperation readiness.</p>
                                    </div>

                                    <div className="w-full md:w-2/3 grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'philosophical', label: 'Philosophical', desc: 'Rational & cooperative' },
                                            { id: 'exacting', label: 'Exacting', desc: 'Demanding & precise' },
                                            { id: 'hysterical', label: 'Hysterical', desc: 'Anxious & pessimistic' },
                                            { id: 'indifferent', label: 'Indifferent', desc: 'Unmotivated & apathetic' }
                                        ].map(opt => (
                                            <SelectCard
                                                key={opt.id}
                                                label={opt.label}
                                                subLabel={opt.desc}
                                                isSelected={formData.mentalAttitude === opt.id}
                                                onClick={() => updateField('mentalAttitude', opt.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <SectionNotes sectionId="residualRidge" formData={formData} updateField={updateField} />
                        </div>
                    )}

                </main>
            </div>

            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md animate-in zoom-in-95 duration-200">
                    <Button variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 h-auto" onClick={() => setSelectedImage(null)}>
                        <X className="w-6 h-6" />
                    </Button>
                    <img src={selectedImage} alt="Preview" className="max-w-full max-h-full rounded-lg shadow-2xl object-contain" />
                </div>
            )}
        </div>
    );
}
