import { useState, useMemo } from 'react';
import { usePatientStore, Patient } from '@/store/usePatientStore';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Trash2, ArrowRight, Users, Activity, Clock, Calendar as CalendarIcon, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PatientsListPage() {
  const { patients, removePatient } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    return patients.filter((p: Patient) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [patients, searchQuery]);

  // Statistics calculations
  const totalPatients = patients.length;
  const newThisMonth = patients.filter(p => {
    // Simple mock logic: if lastVisit is within 30 days
    if (!p.lastVisit) return true; // assuming new if no last visit
    const visitDate = new Date(p.lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 30;
  }).length;

  return (
    <div className="flex flex-col h-full space-y-8 pb-8">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Patient Directory</h2>
          <p className="text-slate-500 mt-1">Manage your clinic's patient records and medical history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button 
            className="bg-teal-500 hover:bg-teal-600 shadow-md shadow-teal-500/20 text-white rounded-xl h-11 px-6 font-semibold transition-all active:scale-95"
            onClick={() => navigate('/patient-entry')}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
            <Users className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Patients</p>
            <h3 className="text-3xl font-bold text-slate-900">{totalPatients}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Activity className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">New This Month</p>
            <h3 className="text-3xl font-bold text-slate-900">{newThisMonth}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Charts Updated Today</p>
            <h3 className="text-3xl font-bold text-slate-900">1</h3>
          </div>
        </div>
      </div>

      {/* Patient Data Table Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search by name, HN, or phone..."
              className="pl-9 h-11 bg-white border-slate-200 rounded-xl focus:ring-teal-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable Card Grid Area */}
        <div className="overflow-y-auto w-full flex-1 p-6 custom-scrollbar bg-slate-50/50">
          {filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-slate-400 space-y-4 py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <UserPlus className="w-10 h-10 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700">No patients found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria or register a new patient.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPatients.map((patient: Patient) => (
                <div 
                  key={patient.id} 
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden cursor-pointer hover:border-teal-200"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{patient.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                            {patient.hn}
                          </span>
                          <span className="text-xs font-medium text-slate-500">{patient.age} yrs • {patient.sex}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Menu Trigger (Hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => removePatient(patient.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Card Body - Clinical Data */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    {/* Alerts (if any) */}
                    {patient.clinicalSummary?.medicalAlerts && patient.clinicalSummary.medicalAlerts.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-[10px]">!</span>
                        <p className="text-xs font-medium text-rose-600 mt-0.5 leading-tight">
                          {patient.clinicalSummary.medicalAlerts.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Chief Complaint */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chief Complaint</p>
                      <p className="text-sm font-medium text-slate-800 line-clamp-2">
                        {patient.clinicalSummary?.chiefComplaint || "No active complaint recorded."}
                      </p>
                    </div>

                    {/* Active Conditions Tags */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Active Conditions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {patient.clinicalSummary?.activeConditions?.length ? (
                          patient.clinicalSummary.activeConditions.map((condition, idx) => (
                            <span key={idx} className="inline-flex px-2 py-1 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-md border border-amber-100">
                              {condition}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-medium text-slate-400">None</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Next Planned */}
                    <div className="mt-auto pt-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Next Planned Treatment</p>
                       <p className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                         {patient.clinicalSummary?.nextPlannedTreatment || "No pending treatments"}
                       </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      Last Visit: {patient.lastVisit || "N/A"}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 group-hover:text-teal-700 transition-colors">
                      Open Chart
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
