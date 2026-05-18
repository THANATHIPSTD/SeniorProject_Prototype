
import { useState } from 'react';
import { usePatientStore } from '@/store/usePatientStore';
import {  useNavigate  } from 'react-router-dom';
import { Search, Plus, User, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PatientsListPage() {
  const { patients, addPatient, removePatient } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const navigate = useNavigate();

  // Create Form State
  const [newName, setNewName] = useState('');
  const [newSex, setNewSex] = useState<'Male'|'Female'|'Other'>('Male');
  const [newAge, setNewAge] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredPatients = patients.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.hn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newAge) {
      const newId = addPatient({
        name: newName,
        sex: newSex,
        age: parseInt(newAge, 10),
      });
      setShowNewModal(false);
      setNewName('');
      setNewAge('');
      navigate(`/patients/${newId}`);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patient Directory</h2>
          <p className="text-slate-500">Manage patient records and clinical history</p>
        </div>
        <Button 
          onClick={() => setShowNewModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Patient
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search by name or HN..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto w-full flex-1 p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient Name</th>
                <th className="px-6 py-4 font-semibold">HN (Hospital No.)</th>
                <th className="px-6 py-4 font-semibold">Sex / Age</th>
                <th className="px-6 py-4 font-semibold">Last Visit</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filteredPatients.map((patient: any) => (
                  <tr key={patient.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => navigate(`/patients/${patient.id}`)}>
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">
                        {patient.name.charAt(0)}
                      </div>
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{patient.hn}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {patient.sex}, {patient.age} yrs
                    </td>
                    <td className="px-6 py-4 text-slate-600">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); removePatient(patient.id); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50" onClick={() => navigate(`/patients/${patient.id}`)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Patient Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                New Patient Record
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleCreatePatient}>
              <div className="p-6 space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                  <Input required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Sex</label>
                    <select 
                      className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white"
                      value={newSex}
                      onChange={(e) => setNewSex(e.target.value as 'Male' | 'Female' | 'Other')}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Age</label>
                    <Input required type="number" min="1" max="120" value={newAge} onChange={(e) => setNewAge(e.target.value)} placeholder="e.g. 35" />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewModal(false)} type="button">Cancel</Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" type="submit">Create Patient</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
