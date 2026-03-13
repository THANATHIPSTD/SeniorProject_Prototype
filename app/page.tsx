'use client';

import { DentalProvider, useDentalStore } from '@/store/useDentalStore';
import MainLayout from '@/components/MainLayout';
import ClinicalExaminationForm from '@/components/ClinicalExaminationForm';
import SmartCharting from '@/components/SmartCharting';
import AIAnalysis from '@/components/AIAnalysis';
import DashboardExport from '@/components/DashboardExport';

function AppContent() {
  const { activeView } = useDentalStore();

  const renderView = () => {
    switch (activeView) {
      case 'clinicalExam':
        return <ClinicalExaminationForm />;
      case 'smartCharting':
        return <SmartCharting />;
      case 'aiAnalysis':
        return <AIAnalysis />;
      case 'dashboard':
      case 'export':
        return <DashboardExport />;
      case 'patientEntry':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800">Patient Entry</h1>
          </div>
        );
      default:
        return <ClinicalExaminationForm />;
    }
  };

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  );
}

export default function Home() {
  return (
    <DentalProvider>
      <AppContent />
    </DentalProvider>
  );
}
