'use client';

import { useState, useEffect } from 'react';
import {
    User, Activity, Smile,
    CheckCircle2, ChevronRight, LayoutGrid, Check
} from 'lucide-react';
import { useDentalStore } from '@/store/useDentalStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FormState {
    chiefComplaint: string; presentIllness: string;
    medicalHistory: string; medications: string; allergies: string;
    dentalHistory: string;
    patientExpectation: string[];
    edentulousTime: string; presentDentureAge: string;

    facialSymmetry: string; facialProfile: string;
    musclePain: string[];
    jointSound: string;
    jawDeviation: string;
    openingMm: string;
    parafunctionalHabit: string[];

    smileLine: string; lipAtRest: string;
    midlineDiscrepancy: string; midlineShiftMm: string;
    nasolabialAngle: string;
    vdoNasolabialFold: string;
    vdoDroopingCommissure: string;
    vdoThinLips: string;
    closestSpeakingSpace: string;
    freewaySpace: string;

    ridgeHeight: string;
    ridgeShapeUpper: string; ridgeShapeLower: string;
    palatalVault: string;
    tongueSize: string; amountOfSaliva: string; mentalAttitude: string;
}

const DEFAULT_STATE: FormState = {
    chiefComplaint: '', presentIllness: '', medicalHistory: '', medications: '', allergies: '', dentalHistory: '',
    patientExpectation: [], edentulousTime: '', presentDentureAge: '',
    facialSymmetry: '', facialProfile: '', musclePain: [], jointSound: '', jawDeviation: '', openingMm: '', parafunctionalHabit: [],
    smileLine: '', lipAtRest: '', midlineDiscrepancy: '', midlineShiftMm: '',
    nasolabialAngle: '', vdoNasolabialFold: 'Normal', vdoDroopingCommissure: 'No', vdoThinLips: 'No',
    closestSpeakingSpace: '', freewaySpace: '',
    ridgeHeight: '', ridgeShapeUpper: '', ridgeShapeLower: '', palatalVault: '', tongueSize: '', amountOfSaliva: '', mentalAttitude: ''
};

const SECTIONS = [
    { id: 'patientInfo', title: 'Patient History', icon: User },
    { id: 'extraoral', title: 'Extraoral Exam', icon: Activity },
    { id: 'esthetic', title: 'Esthetic & VDO', icon: Smile },
    { id: 'ridge', title: 'Ridge & Soft Tissue', icon: LayoutGrid },
];

export default function ClinicalExaminationForm() {
    const [activeTab, setActiveTab] = useState('patientInfo');
    const [formData, setFormData] = useState<FormState>(DEFAULT_STATE);
    const { triggerQuickNormal } = useDentalStore();

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

    const applySmartDefaults = (section?: string) => {
        setFormData(prev => {
            let next = { ...prev };
            if (!section || section === 'extraoral' || section === 'global') {
                next = { ...next, facialSymmetry: 'Symmetric', facialProfile: 'Straight', musclePain: [], jointSound: 'None', jawDeviation: 'None', parafunctionalHabit: [] };
            }
            if (!section || section === 'esthetic' || section === 'global') {
                next = { ...next, smileLine: 'Average', lipAtRest: 'Average', nasolabialAngle: '90', midlineDiscrepancy: 'Symmetric', midlineShiftMm: '', vdoNasolabialFold: 'Normal', vdoDroopingCommissure: 'No', vdoThinLips: 'No' };
            }
            if (!section || section === 'ridge' || section === 'global') {
                next = { ...next, ridgeHeight: 'High', ridgeShapeUpper: 'U shape', ridgeShapeLower: 'U shape', palatalVault: 'Average', tongueSize: 'Medium', amountOfSaliva: 'Normal', mentalAttitude: 'Philosophical' };
            }
            return next;
        });
    };

    useEffect(() => {
        if (triggerQuickNormal > 0) applySmartDefaults('global');
    }, [triggerQuickNormal]);

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

    const MultiSelectCard = ({ label, value, currentValues, onToggle, className }: { label: string, value: string, currentValues: string[], onToggle: (v: string) => void, className?: string }) => {
        const isSelected = currentValues.includes(value);
        return (
            <button
                type="button"
                onClick={() => onToggle(value)}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left",
                    isSelected ? "border-teal-500 bg-teal-50 text-teal-800 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    className
                )}
            >
                <div className={cn("flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors", isSelected ? "bg-teal-500 border-teal-500 text-white" : "border-slate-300 bg-white")}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="flex-1">{label}</span>
            </button>
        );
    };

    const renderPatientInfo = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Chief Complaint</span><textarea value={formData.chiefComplaint} onChange={e => updateField('chiefComplaint', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 h-20 resize-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="Patient's primary reason for visiting..." /></label>
                <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Present Illness</span><textarea value={formData.presentIllness} onChange={e => updateField('presentIllness', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 h-20 resize-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="History of present illness..." /></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Medical History</span><input type="text" value={formData.medicalHistory} onChange={e => updateField('medicalHistory', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="Systemic diseases, e.g., Diabetes" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Current Medications</span><input type="text" value={formData.medications} onChange={e => updateField('medications', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="e.g., Amlodipine" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Allergies</span><input type="text" value={formData.allergies} onChange={e => updateField('allergies', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="e.g., Penicillin, Latex" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Dental History</span><input type="text" value={formData.dentalHistory} onChange={e => updateField('dentalHistory', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="e.g., Regular checkup, Periodontal treatment" /></label>
                </div>
            </div>
            <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Expectations</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Chewing', 'Esthetic', 'Health', 'Phonetics'].map(opt => (
                            <MultiSelectCard key={opt} label={opt} value={opt} currentValues={formData.patientExpectation} onToggle={v => toggleArrayField('patientExpectation', v)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderExtraoral = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Extraoral & TMJ Examination</h2>
                <button type="button" onClick={() => applySmartDefaults('extraoral')} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-teal-100 transition-colors shadow-sm"><CheckCircle2 className="w-4 h-4" />Smart Sections Default</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Facial Symmetry</span><div className="grid grid-cols-2 gap-3">{['Symmetric', 'Asymmetric'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.facialSymmetry} onChange={v => updateField('facialSymmetry', v)} />))}</div></div>
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Facial Profile</span><div className="grid grid-cols-3 gap-3">{['Convex', 'Straight', 'Concave'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.facialProfile} onChange={v => updateField('facialProfile', v)} className="py-2" />))}</div></div>
                <div className="space-y-3 md:col-span-2"><span className="text-base font-semibold text-slate-700 block gap-2 flex items-center">Muscle Pain<span className="text-xs font-normal text-slate-500 ml-1">(Multi-select regions)</span></span><div className="grid grid-cols-2 sm:grid-cols-6 gap-3">{['Masseter (R)', 'Masseter (L)', 'Temporalis (R)', 'Temporalis (L)', 'Pterygoid (R)', 'Pterygoid (L)'].map(opt => (<MultiSelectCard key={opt} label={opt} value={opt} currentValues={formData.musclePain} onToggle={v => toggleArrayField('musclePain', v)} className="py-2 text-xs" />))}</div></div>
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Joint Sound</span><div className="grid grid-cols-2 gap-3">{['None', 'Clicking', 'Crepitus', 'Popping'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.jointSound} onChange={v => updateField('jointSound', v)} />))}</div></div>
                <div className="space-y-3 md:col-span-2"><span className="text-base font-semibold text-slate-700 block">Jaw Deviation & Opening</span><div className="flex flex-col md:flex-row gap-4"><div className="grid grid-cols-3 gap-3 flex-1">{['None', 'To the left', 'To the right'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.jawDeviation} onChange={v => updateField('jawDeviation', v)} className="py-2 text-xs text-center" />))}</div><div className="md:w-48"><div className="relative"><input type="number" value={formData.openingMm} onChange={e => updateField('openingMm', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 pr-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" placeholder="Max Opening" /><span className="absolute right-4 top-3.5 text-slate-500 text-sm font-medium">mm</span></div></div></div></div>
            </div>
        </div>
    );

    const renderEsthetic = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Esthetic & VDO Evaluation</h2>
                <button type="button" onClick={() => applySmartDefaults('esthetic')} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-teal-100 transition-colors shadow-sm"><CheckCircle2 className="w-4 h-4" />Smart Sections Default</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Smile Line</span><div className="grid grid-cols-3 gap-3">{['High', 'Average', 'Low'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.smileLine} onChange={v => updateField('smileLine', v)} />))}</div></div>
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Lip at rest</span><div className="grid grid-cols-3 gap-3">{['Full', 'Average', 'Thin'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.lipAtRest} onChange={v => updateField('lipAtRest', v)} />))}</div></div>
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Nasolabial Angle</span><div className="grid grid-cols-3 gap-3">{['90', '<90', '>90'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.nasolabialAngle} onChange={v => updateField('nasolabialAngle', v)} />))}</div></div>
                <div className="space-y-3 md:col-span-2"><span className="text-base font-semibold text-slate-700 block">Midline Discrepancy</span><div className="flex flex-col md:flex-row gap-4"><div className="grid grid-cols-3 gap-3 flex-1">{['Symmetric', 'Right Shift', 'Left Shift'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.midlineDiscrepancy} onChange={v => updateField('midlineDiscrepancy', v)} />))}</div>{['Right Shift', 'Left Shift'].includes(formData.midlineDiscrepancy) && (<div className="md:w-48"><div className="relative"><input type="number" value={formData.midlineShiftMm} onChange={e => updateField('midlineShiftMm', e.target.value)} className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 pr-10 focus:ring-2 focus:ring-teal-500 border" placeholder="Distance" /><span className="absolute right-4 top-3.5 text-slate-500 text-sm font-medium">mm</span></div></div>)}</div></div>
                <div className="space-y-3 md:col-span-2 border-t pt-6">
                    <span className="text-lg font-bold text-slate-800 block mb-4">VDO Evaluations</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2"><span className="text-sm font-semibold text-slate-600 block">Nasolabial fold</span><div className="grid grid-cols-2 gap-2">{['Normal', 'Deep'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.vdoNasolabialFold} onChange={v => updateField('vdoNasolabialFold', v)} className="py-2" />))}</div></div>
                        <div className="space-y-2"><span className="text-sm font-semibold text-slate-600 block">Drooping commissure</span><div className="grid grid-cols-2 gap-2">{['No', 'Yes'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.vdoDroopingCommissure} onChange={v => updateField('vdoDroopingCommissure', v)} className="py-2" />))}</div></div>
                        <div className="space-y-2"><span className="text-sm font-semibold text-slate-600 block">Thin lips</span><div className="grid grid-cols-2 gap-2">{['No', 'Yes'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.vdoThinLips} onChange={v => updateField('vdoThinLips', v)} className="py-2" />))}</div></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Closest Speaking Space</span><div className="relative"><input type="number" value={formData.closestSpeakingSpace} onChange={e => updateField('closestSpeakingSpace', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 pr-10 focus:bg-white focus:ring-2 focus:ring-teal-500" placeholder="Measurement" /><span className="absolute right-4 top-3.5 text-slate-500 text-sm font-medium">mm</span></div></label>
                        <label className="block"><span className="text-sm font-semibold text-slate-700 mb-2 block">Freeway Space (VDO - VDR)</span><div className="relative"><input type="number" value={formData.freewaySpace} onChange={e => updateField('freewaySpace', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 pr-10 focus:bg-white focus:ring-2 focus:ring-teal-500" placeholder="Measurement" /><span className="absolute right-4 top-3.5 text-slate-500 text-sm font-medium">mm</span></div></label>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRidge = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Ridge & Soft Tissue Assessment</h2>
                <button type="button" onClick={() => applySmartDefaults('ridge')} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-teal-100 transition-colors shadow-sm"><CheckCircle2 className="w-4 h-4" />Smart Sections Default</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2 lg:col-span-1"><span className="text-base font-semibold text-slate-700 block">Ridge Height</span><div className="grid grid-cols-3 gap-3">{['High', 'Low', 'Knife edge'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.ridgeHeight} onChange={v => updateField('ridgeHeight', v)} className="text-xs sm:text-sm" />))}</div></div>
                <div className="space-y-3 md:col-span-2 lg:col-span-1"><span className="text-base font-semibold text-slate-700 block">Palatal Vault</span><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{['Average', 'Steep', 'V shape', 'Shallow'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.palatalVault} onChange={v => updateField('palatalVault', v)} className="text-xs sm:text-sm" />))}</div></div>
                <div className="space-y-3 md:col-span-2"><span className="text-base font-semibold text-slate-700 block border-b pb-2 mb-4">Ridge Shape</span><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><span className="text-sm font-medium text-slate-500 mb-2 block">Upper Arch</span><div className="grid grid-cols-2 lg:grid-cols-4 gap-2">{['U shape', 'V shape', 'Flat', 'Undercut'].map(opt => (<RadioCard key={`u-${opt}`} label={opt} value={opt} currentValue={formData.ridgeShapeUpper} onChange={v => updateField('ridgeShapeUpper', v)} className="py-2" />))}</div></div><div><span className="text-sm font-medium text-slate-500 mb-2 block">Lower Arch</span><div className="grid grid-cols-2 lg:grid-cols-4 gap-2">{['U shape', 'V shape', 'Flat', 'Undercut'].map(opt => (<RadioCard key={`l-${opt}`} label={opt} value={opt} currentValue={formData.ridgeShapeLower} onChange={v => updateField('ridgeShapeLower', v)} className="py-2" />))}</div></div></div></div>
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Tongue Size</span><div className="grid grid-cols-3 gap-3">{['Small', 'Medium', 'Large'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.tongueSize} onChange={v => updateField('tongueSize', v)} />))}</div></div>
                <div className="space-y-3"><span className="text-base font-semibold text-slate-700 block">Amount of Saliva</span><div className="grid grid-cols-2 gap-3">{['Normal', 'Xerostomia'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.amountOfSaliva} onChange={v => updateField('amountOfSaliva', v)} />))}</div></div>
                <div className="space-y-3 md:col-span-2"><span className="text-base font-semibold text-slate-700 block">Mental Attitude (House)</span><div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{['Philosophical', 'Exacting', 'Hysterical'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.mentalAttitude} onChange={v => updateField('mentalAttitude', v)} />))}</div></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4 shrink-0 overflow-y-auto">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">Sections</h3>
                    <div className="space-y-1.5 flex-1">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeTab === section.id;
                            return (
                                <button key={section.id} onClick={() => setActiveTab(section.id)} className={cn("w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group text-left", isActive ? "bg-white shadow-sm border border-slate-200 text-teal-600" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent")}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", isActive ? "bg-teal-50 text-teal-600" : "bg-slate-200 text-slate-500 group-hover:bg-slate-300")}><Icon className="w-4 h-4" /></div>
                                        <span className="font-semibold text-sm">{section.title}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 text-teal-500 opacity-50" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
                        {activeTab === 'patientInfo' && renderPatientInfo()}
                        {activeTab === 'extraoral' && renderExtraoral()}
                        {activeTab === 'esthetic' && renderEsthetic()}
                        {activeTab === 'ridge' && renderRidge()}
                    </div>
                </div>
            </div>
        </div>
    );
}
