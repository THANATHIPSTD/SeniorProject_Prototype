'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Shared state for the app, focusing primarily on Global "Quick Normal" triggers and active views
type ViewType = 'dashboard' | 'patientEntry' | 'clinicalExam' | 'smartCharting' | 'aiAnalysis' | 'export';

interface DentalState {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
    triggerQuickNormal: number; // A simple counter to trigger effects
    fireQuickNormal: () => void;
    patientContext: {
        name: string;
        hn: string;
        age: string;
        advisor: string;
        date: string;
    };
}

const defaultState: DentalState = {
    activeView: 'clinicalExam',
    setActiveView: () => { },
    triggerQuickNormal: 0,
    fireQuickNormal: () => { },
    patientContext: {
        name: 'John Doe',
        hn: '102938',
        age: '45',
        advisor: 'Dr. Smith',
        date: '20 Oct 2025'
    }
};

const DentalContext = createContext<DentalState>(defaultState);

export const DentalProvider = ({ children }: { children: ReactNode }) => {
    const [activeView, setActiveView] = useState<ViewType>('clinicalExam');
    const [triggerQuickNormal, setTriggerQuickNormal] = useState(0);

    const fireQuickNormal = () => setTriggerQuickNormal(prev => prev + 1);

    return (
        <DentalContext.Provider value={{
            ...defaultState,
            activeView,
            setActiveView,
            triggerQuickNormal,
            fireQuickNormal
        }}>
            {children}
        </DentalContext.Provider>
    );
};

export const useDentalStore = () => useContext(DentalContext);
