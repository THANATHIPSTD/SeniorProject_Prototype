import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';

// Import Pages
import HomePage from '@/pages/Home';
import ClinicalExamPage from '@/pages/ClinicalExam';
import PatientEntryPage from '@/pages/PatientEntry';
import PatientsListPage from '@/pages/Patients';
import PatientDetailPage from '@/pages/PatientDetail';
import PatientImagesPage from '@/pages/PatientImages';
import PatientChartNewPage from '@/pages/PatientChartNew';
import PatientAIAnalysisPage from '@/pages/PatientAIAnalysis';
import DashboardPage from '@/pages/Dashboard';
import SmartChartingPage from '@/pages/SmartCharting';
import ExportPage from '@/pages/Export';
import AIAnalysisPage from '@/pages/AIAnalysis';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clinical-exam" element={<ClinicalExamPage />} />
          <Route path="/patient-entry" element={<PatientEntryPage />} />
          <Route path="/patients" element={<PatientsListPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/patients/:id/images" element={<PatientImagesPage />} />
          <Route path="/patients/:id/chart/new" element={<PatientChartNewPage />} />
          <Route path="/patients/:id/ai-analysis" element={<PatientAIAnalysisPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/smart-charting" element={<SmartChartingPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/ai-analysis" element={<AIAnalysisPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
