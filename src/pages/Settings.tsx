import { useState } from 'react';
import { User, Building2, Sliders, Bell, LogOut, Shield, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'clinic', label: 'Clinic Details', icon: Building2 },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col h-full space-y-8 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-slate-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-5 h-5 text-rose-500" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900">My Profile</h3>
                <p className="text-sm text-slate-500">Update your personal information and public profile.</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-teal-500/20">
                  {user?.name?.charAt(0).toUpperCase() || 'D'}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="h-9 px-4 rounded-lg font-semibold">Change Avatar</Button>
                  <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={user?.name || ''} className="h-11 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={user?.email || ''} type="email" className="h-11 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input defaultValue="DENT-2023-4451" className="h-11 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input defaultValue="General Dentistry" className="h-11 rounded-xl bg-slate-50" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="h-11 px-8 rounded-xl font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Clinic Settings */}
          {activeTab === 'clinic' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Clinic Details</h3>
                <p className="text-sm text-slate-500">Manage your clinic's public information and contact details.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                <div className="space-y-2">
                  <Label>Clinic Name</Label>
                  <Input defaultValue="SmileCare Dental Clinic" className="h-11 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label>Clinic Address</Label>
                  <Input defaultValue="123 Sukhumvit Road, Bangkok 10110" className="h-11 rounded-xl bg-slate-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input defaultValue="02-123-4567" className="h-11 rounded-xl bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID</Label>
                    <Input defaultValue="0105552000000" className="h-11 rounded-xl bg-slate-50" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="h-11 px-8 rounded-xl font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Preferences</h3>
                <p className="text-sm text-slate-500">Customize how the application looks and feels.</p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div>
                    <h4 className="font-semibold text-slate-900">System Language</h4>
                    <p className="text-sm text-slate-500">Select your preferred language.</p>
                  </div>
                  <select className="h-10 rounded-lg border-slate-200 text-sm font-medium focus:ring-teal-500">
                    <option>English (US)</option>
                    <option>Thai (ภาษาไทย)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div>
                    <h4 className="font-semibold text-slate-900">Tooth Numbering System</h4>
                    <p className="text-sm text-slate-500">Default notation for odontogram.</p>
                  </div>
                  <select className="h-10 rounded-lg border-slate-200 text-sm font-medium focus:ring-teal-500">
                    <option>FDI World Dental Federation</option>
                    <option>Universal Numbering System</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {['notifications', 'security', 'billing'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 animate-in fade-in duration-300 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Sliders className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 capitalize">{activeTab}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">This section is currently under construction for the prototype.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
