import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './pages/globals.css'
import App from './App.tsx'
import { MedicalProvider } from '@/store/useDentalStore'
import { TooltipProvider } from '@/components/ui/tooltip'
import '../src/components/odontogram/odontogram.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MedicalProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </MedicalProvider>
  </StrictMode>,
)
