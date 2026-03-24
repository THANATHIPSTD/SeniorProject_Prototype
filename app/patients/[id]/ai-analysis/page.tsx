'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePatientStore } from '@/store/usePatientStore';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIAnalysis from '@/components/AIAnalysis';

export default function PatientAIAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { patients } = usePatientStore();
  
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const patient = patients.find((p) => p.id === idStr);

  if (!patient) return <div className="p-8">Patient not found</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between shrink-0 shadow-sm z-10 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="p-2 h-auto text-slate-500" onClick={() => router.push(`/patients/${patient.id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              X-Ray Condition Detection
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{patient.name}</span>
              <span>•</span>
              <span>{patient.hn}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto w-full h-full">
            {/* We reuse the beautiful mock AI Analysis component */}
            <AIAnalysis />
        </div>
      </div>
    </div>
  );
}
