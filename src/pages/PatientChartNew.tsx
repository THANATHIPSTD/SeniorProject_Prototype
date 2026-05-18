
import { useState } from 'react';
import {  useParams, useNavigate  } from 'react-router-dom';
import { usePatientStore } from '@/store/usePatientStore';
import { ArrowLeft, Save, ClipboardList, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import existing charting components
import ClinicalExaminationForm from '@/components/ClinicalExaminationForm';
import SmartCharting from '@/components/SmartCharting';

export default function NewChartPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { patients } = usePatientStore();
  
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const patient = patients.find((p) => p.id === idStr);

  const [activeTab, setActiveTab] = useState<'clinical' | 'dental'>('clinical');

  if (!patient) {
    return <div className="p-8">Patient not found</div>;
  }

  const handleSave = () => {
    // Mock save
    alert('Chart saved successfully!');
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="p-2 h-auto text-slate-500" onClick={() => navigate(`/patients/${patient.id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
            <div className="border-l border-slate-200 pl-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              New Dental Chart
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
                Draft
              </Badge>
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{patient.name}</span>
              <span>•</span>
              <span>{patient.hn}</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 mr-4">
            <button
              onClick={() => setActiveTab('clinical')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'clinical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Clinical Exam
            </button>
            <button
              onClick={() => setActiveTab('dental')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'dental' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              Medical Charting
            </button>
          </div>
          <Button variant="outline" onClick={() => navigate(`/patients/${patient.id}`)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Chart
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative p-6">
        <div className="max-w-7xl mx-auto w-full h-full">
          {activeTab === 'clinical' && (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <ClinicalExaminationForm />
             </div>
          )}
          {activeTab === 'dental' && (
             <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <SmartCharting />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
