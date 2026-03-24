'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePatientStore } from '@/store/usePatientStore';
import { ArrowLeft, Save, Upload, Trash2, X, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageStore } from '@/store/useImageStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

import OdontogramUI from '@/components/odontogram/OdontogramUI';
import OcclusalAnalysis from '@/components/OcclusalAnalysis';

// 8 Sections Requested by User:
const SECTIONS = [
    { id: 'images', title: 'Images' },
    { id: 'patientHistory', title: 'Patient History' },
    { id: 'extraoral', title: 'Extraoral examination' },
    { id: 'esthetic', title: 'Esthetic evaluation' },
    { id: 'vdo', title: 'VDO evaluations' },
    { id: 'dentalStatus', title: 'Dental status (Odontogram)' },
    { id: 'occlusal', title: 'Occlusal analysis' },
    { id: 'residualRidge', title: 'Residual ridge area' }
];

interface FormState {
    chiefComplaint: string; presentIllness: string;
    medicalHistory: string; medications: string; allergies: string;
    dentalHistory: string;
    patientExpectation: string[];
    facialSymmetry: string; facialProfile: string;
    musclePain: string[]; jointSound: string; jawDeviation: string; openingMm: string;
    smileLine: string; lipAtRest: string; midlineDiscrepancy: string; midlineShiftMm: string; nasolabialAngle: string;
    vdoNasolabialFold: string; vdoDroopingCommissure: string; vdoThinLips: string; closestSpeakingSpace: string; freewaySpace: string;
    ridgeHeight: string; ridgeShapeUpper: string; ridgeShapeLower: string; palatalVault: string;
    tongueSize: string; amountOfSaliva: string; mentalAttitude: string;
}

const DEFAULT_STATE: FormState = {
    chiefComplaint: '', presentIllness: '', medicalHistory: '', medications: '', allergies: '', dentalHistory: '',
    patientExpectation: [],
    facialSymmetry: '', facialProfile: '', musclePain: [], jointSound: '', jawDeviation: '', openingMm: '',
    smileLine: '', lipAtRest: '', midlineDiscrepancy: '', midlineShiftMm: '', nasolabialAngle: '',
    vdoNasolabialFold: 'Normal', vdoDroopingCommissure: 'No', vdoThinLips: 'No', closestSpeakingSpace: '', freewaySpace: '',
    ridgeHeight: '', ridgeShapeUpper: '', ridgeShapeLower: '', palatalVault: '', tongueSize: '', amountOfSaliva: '', mentalAttitude: ''
};

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


export default function SequentialPatientPage() {
    const params = useParams();
    const router = useRouter();
    const { patients } = usePatientStore();
    const { images, addImage, removeImage } = useImageStore();

    const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const patient = patients.find((p) => p.id === idStr);

    const [activeSection, setActiveSection] = useState<string>('images');

    const [formData, setFormData] = useState<FormState>(DEFAULT_STATE);

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

    const handleSave = () => {
        alert('Patient record saved successfully!');
        router.push(`/patients`);
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
                    <Button variant="ghost" className="p-2 h-auto text-slate-500 hover:bg-slate-100" onClick={() => router.push(`/patients`)}>
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
            <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">

                {/* Left Sidebar Menu */}
                <aside className="w-72 bg-white border-r border-slate-200 flex flex-col pt-6 shrink-0 z-0 overflow-y-auto">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-6">Charting Syllabus</h3>
                    <div className="flex-1 px-3 space-y-1">
                        {SECTIONS.map((sec, idx) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => setActiveSection(sec.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-3 rounded-xl text-left text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100"
                                            : "text-slate-600 hover:bg-slate-100 border border-transparent"
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={cn(
                                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono transition-colors",
                                            isActive ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500 group-hover:bg-slate-300"
                                        )}>
                                            {idx + 1}
                                        </span>
                                        {sec.title}
                                    </span>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
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
                        </div>
                    )}

                    {/* 2. Patient History */}
                    {activeSection === 'patientHistory' && (
                        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Patient History</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="chiefComplaint" className="text-sm font-semibold text-slate-700">Chief Complaint</Label>
                                    <Textarea id="chiefComplaint" value={formData.chiefComplaint} onChange={e => updateField('chiefComplaint', e.target.value)} className="h-24 resize-none bg-white shadow-sm" placeholder="Patient's primary reason for visiting..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="presentIllness" className="text-sm font-semibold text-slate-700">Present Illness</Label>
                                    <Textarea id="presentIllness" value={formData.presentIllness} onChange={e => updateField('presentIllness', e.target.value)} className="h-24 resize-none bg-white shadow-sm" placeholder="History of present illness..." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="medicalHistory" className="text-sm font-semibold text-slate-700">Medical History</Label>
                                        <Input id="medicalHistory" value={formData.medicalHistory} onChange={e => updateField('medicalHistory', e.target.value)} className="bg-white shadow-sm" placeholder="Systemic diseases, e.g., Diabetes" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="medications" className="text-sm font-semibold text-slate-700">Current Medications</Label>
                                        <Input id="medications" value={formData.medications} onChange={e => updateField('medications', e.target.value)} className="bg-white shadow-sm" placeholder="e.g., Amlodipine" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="allergies" className="text-sm font-semibold text-slate-700">Allergies</Label>
                                        <Input id="allergies" value={formData.allergies} onChange={e => updateField('allergies', e.target.value)} className="bg-white shadow-sm" placeholder="e.g., Penicillin, Latex" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dentalHistory" className="text-sm font-semibold text-slate-700">Dental History</Label>
                                        <Input id="dentalHistory" value={formData.dentalHistory} onChange={e => updateField('dentalHistory', e.target.value)} className="bg-white shadow-sm" placeholder="e.g., Regular checkup, Periodontal treatment" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <Label className="text-sm font-semibold text-slate-700 mb-3 block">Patient Expectations</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['Chewing', 'Esthetic', 'Health', 'Phonetics'].map(opt => (
                                            <MultiSelectCard key={opt} label={opt} value={opt} currentValues={formData.patientExpectation} onToggle={v => toggleArrayField('patientExpectation', v)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Extraoral examination */}
                    {activeSection === 'extraoral' && (
                        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Extraoral Examination</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Facial Symmetry</span><div className="grid grid-cols-2 gap-3">{['Symmetric', 'Asymmetric'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.facialSymmetry} onChange={v => updateField('facialSymmetry', v)} />))}</div></div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Facial Profile</span><div className="grid grid-cols-3 gap-3">{['Convex', 'Straight', 'Concave'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.facialProfile} onChange={v => updateField('facialProfile', v)} />))}</div></div>
                                <div className="space-y-3 md:col-span-2"><span className="text-sm font-semibold text-slate-700 block">Muscle Pain<span className="text-xs font-normal text-slate-500 ml-1">(Multi-select)</span></span><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{['Masseter (R)', 'Masseter (L)', 'Temporalis (R)', 'Temporalis (L)', 'Pterygoid (R)', 'Pterygoid (L)'].map(opt => (<MultiSelectCard key={opt} label={opt} value={opt} currentValues={formData.musclePain} onToggle={v => toggleArrayField('musclePain', v)} />))}</div></div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Joint Sound</span><div className="grid grid-cols-2 gap-3">{['None', 'Clicking', 'Crepitus', 'Popping'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.jointSound} onChange={v => updateField('jointSound', v)} />))}</div></div>
                                <div className="space-y-3 md:col-span-2"><span className="text-sm font-semibold text-slate-700 block mb-2">Jaw Deviation & Opening</span><div className="flex flex-col md:flex-row gap-6"><div className="grid grid-cols-3 gap-3 flex-1">{['None', 'To the left', 'To the right'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.jawDeviation} onChange={v => updateField('jawDeviation', v)} />))}</div><div className="md:w-48"><div className="relative"><Input type="number" value={formData.openingMm} onChange={e => updateField('openingMm', e.target.value)} className="pr-12 bg-white" placeholder="Max Opening" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">mm</span></div></div></div></div>
                            </div>
                        </div>
                    )}

                    {/* 4. Esthetic evaluation */}
                    {activeSection === 'esthetic' && (
                        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Esthetic Evaluation</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Smile Line</span><div className="grid grid-cols-3 gap-3">{['High', 'Average', 'Low'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.smileLine} onChange={v => updateField('smileLine', v)} />))}</div></div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Lip at rest</span><div className="grid grid-cols-3 gap-3">{['Full', 'Average', 'Thin'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.lipAtRest} onChange={v => updateField('lipAtRest', v)} />))}</div></div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Nasolabial Angle</span><div className="grid grid-cols-3 gap-3">{['90', '<90', '>90'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.nasolabialAngle} onChange={v => updateField('nasolabialAngle', v)} />))}</div></div>
                                <div className="space-y-3 md:col-span-2"><span className="text-sm font-semibold text-slate-700 block">Midline Discrepancy</span><div className="flex flex-col md:flex-row gap-4"><div className="grid grid-cols-3 gap-3 flex-1">{['Symmetric', 'Right Shift', 'Left Shift'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.midlineDiscrepancy} onChange={v => updateField('midlineDiscrepancy', v)} />))}</div>{['Right Shift', 'Left Shift'].includes(formData.midlineDiscrepancy) && (<div className="md:w-48"><div className="relative"><Input type="number" value={formData.midlineShiftMm} onChange={e => updateField('midlineShiftMm', e.target.value)} className="pr-10 bg-white" placeholder="Distance" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">mm</span></div></div>)}</div></div>
                            </div>
                        </div>
                    )}

                    {/* 5. VDO evaluations */}
                    {activeSection === 'vdo' && (
                        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">VDO Evaluations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2"><span className="text-sm font-semibold text-slate-600 block">Nasolabial fold</span><div className="grid grid-cols-2 gap-2">{['Normal', 'Deep'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.vdoNasolabialFold} onChange={v => updateField('vdoNasolabialFold', v)} />))}</div></div>
                                <div className="space-y-2"><span className="text-sm font-semibold text-slate-600 block">Drooping commissure</span><div className="grid grid-cols-2 gap-2">{['No', 'Yes'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.vdoDroopingCommissure} onChange={v => updateField('vdoDroopingCommissure', v)} />))}</div></div>
                                <div className="space-y-2"><span className="text-sm font-semibold text-slate-600 block">Thin lips</span><div className="grid grid-cols-2 gap-2">{['No', 'Yes'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.vdoThinLips} onChange={v => updateField('vdoThinLips', v)} />))}</div></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="closestSpeakingSpace" className="text-sm font-semibold text-slate-700">Closest Speaking Space</Label>
                                    <div className="relative"><Input id="closestSpeakingSpace" type="number" value={formData.closestSpeakingSpace} onChange={e => updateField('closestSpeakingSpace', e.target.value)} className="pr-10 bg-white" placeholder="Measurement" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">mm</span></div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="freewaySpace" className="text-sm font-semibold text-slate-700">Freeway Space (VDO - VDR)</Label>
                                    <div className="relative"><Input id="freewaySpace" type="number" value={formData.freewaySpace} onChange={e => updateField('freewaySpace', e.target.value)} className="pr-10 bg-white" placeholder="Measurement" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">mm</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. Dental status */}
                    {activeSection === 'dentalStatus' && (
                        <div className="h-full w-full flex flex-col gap-4 animate-in fade-in duration-300 max-w-none">
                            {/* Bottom Side: Dental Status */}
                            <div className="flex-1 w-full overflow-visible min-h-[500px]">
                                <OdontogramUI />
                            </div>
                        </div>
                    )}

                    {/* 7. Occlusal analysis */}
                    {activeSection === 'occlusal' && (
                        <OcclusalAnalysis />
                    )}

                    {/* 8. Residual ridge area */}
                    {activeSection === 'residualRidge' && (
                        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Residual Ridge Area</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Ridge Height</span><div className="grid grid-cols-3 gap-3">{['High', 'Low', 'Knife edge'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.ridgeHeight} onChange={v => updateField('ridgeHeight', v)} />))}</div></div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Palatal Vault</span><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{['Average', 'Steep', 'V shape', 'Shallow'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.palatalVault} onChange={v => updateField('palatalVault', v)} />))}</div></div>
                                <div className="space-y-3 md:col-span-2">
                                    <span className="text-sm font-semibold text-slate-700 block border-b pb-2 mb-4">Ridge Shape</span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><span className="text-sm font-medium text-slate-500 mb-2 block">Upper Arch</span><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{['U shape', 'V shape', 'Flat', 'Undercut'].map(opt => (<RadioCard key={`upper-${opt}`} label={opt} value={opt} currentValue={formData.ridgeShapeUpper} onChange={v => updateField('ridgeShapeUpper', v)} />))}</div></div>
                                        <div><span className="text-sm font-medium text-slate-500 mb-2 block">Lower Arch</span><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{['U shape', 'V shape', 'Flat', 'Undercut'].map(opt => (<RadioCard key={`lower-${opt}`} label={opt} value={opt} currentValue={formData.ridgeShapeLower} onChange={v => updateField('ridgeShapeLower', v)} />))}</div></div>
                                    </div>
                                </div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Tongue Size</span><div className="grid grid-cols-3 gap-3">{['Small', 'Medium', 'Large'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.tongueSize} onChange={v => updateField('tongueSize', v)} />))}</div></div>
                                <div className="space-y-3"><span className="text-sm font-semibold text-slate-700 block">Amount of Saliva</span><div className="grid grid-cols-2 gap-3">{['Normal', 'Xerostomia'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.amountOfSaliva} onChange={v => updateField('amountOfSaliva', v)} />))}</div></div>
                                <div className="space-y-3 md:col-span-2"><span className="text-sm font-semibold text-slate-700 block">Mental Attitude (House)</span><div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{['Philosophical', 'Exacting', 'Hysterical'].map(opt => (<RadioCard key={opt} label={opt} value={opt} currentValue={formData.mentalAttitude} onChange={v => updateField('mentalAttitude', v)} />))}</div></div>
                            </div>
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
