import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Patient {
  id: string;
  name: string;
  sex: 'Male' | 'Female' | 'Other';
  age: number;
  hn: string; // Hospital Number
  lastVisit?: string;
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'hn'>) => string;
  removePatient: (id: string) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [
        {
          id: '1',
          name: 'Jane Doe',
          sex: 'Female',
          age: 32,
          hn: 'HN-10001',
          lastVisit: '2026-03-10',
        },
        {
          id: '2',
          name: 'John Smith',
          sex: 'Male',
          age: 45,
          hn: 'HN-10002',
          lastVisit: '2026-02-15',
        },
      ],
      addPatient: (patient) => {
        const id = Math.random().toString(36).substr(2, 9);
        const hn = `HN-${10000 + get().patients.length + 1}`;
        set((state) => ({
          patients: [{ ...patient, id, hn, lastVisit: new Date().toISOString().split('T')[0] }, ...state.patients],
        }));
        return id;
      },
      removePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),
      updatePatient: (id, updates) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
    }),
    {
      name: 'imrs-patient-storage',
    }
  )
);
