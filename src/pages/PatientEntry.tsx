import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/store/usePatientStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Activity, Hash, User, Phone, Calendar, Stethoscope } from 'lucide-react';

export default function PatientEntryPage() {
  const navigate = useNavigate();
  const addPatient = usePatientStore((state) => state.addPatient);

  const [formData, setFormData] = useState({
    hn: '',
    name: '',
    age: '',
    sex: 'Other' as 'Male' | 'Female' | 'Other',
    phone: '',
    dob: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    // Use empty string as undefined for HN so it autogenerates if omitted
    addPatient({
      name: formData.name,
      age: formData.age ? parseInt(formData.age, 10) : 0,
      sex: formData.sex,
      hn: formData.hn.trim() || '',
      phone: formData.phone.trim(),
      dob: formData.dob,
    });

    // Navigate to patients list after adding
    navigate('/patients');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Patient Registration</h1>
          <p className="text-slate-500 mt-1">Enter the patient's details below to create a new medical record.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex items-center gap-3">
          <Stethoscope className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800">Clinical Profile</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* HN Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="hn" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" />
                Hospital Number (HN)
              </Label>
              <Input
                id="hn"
                name="hn"
                placeholder="Leave blank to auto-generate"
                value={formData.hn}
                onChange={handleChange}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
              <p className="text-xs text-slate-500 font-medium ml-1">If unknown, the system will assign one.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Full Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Demographics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label htmlFor="sex" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Biological Sex
              </Label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold text-slate-700">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                placeholder="e.g. 30"
                value={formData.age}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. 081-234-5678"
                value={formData.phone}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/patients')}
              className="h-11 px-6 rounded-xl font-semibold text-slate-600 hover:text-slate-900 border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-8 rounded-xl font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20 transition-all active:scale-95"
            >
              Register Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
