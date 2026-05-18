import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PatientImage {
  id: string;
  patientId: string;
  type: 'intraoral' | 'panoramic';
  url: string;
  filename: string;
  uploadDate: string;
}

interface ImageState {
  images: PatientImage[];
  addImage: (image: Omit<PatientImage, 'id' | 'uploadDate'>) => void;
  removeImage: (id: string) => void;
}

export const useImageStore = create<ImageState>()(
  persist(
    (set) => ({
      images: [
        {
          id: 'mock-pt1-img1',
          patientId: '1',
          type: 'panoramic',
          url: '/Paronamic.png',
          filename: 'panoramic_xray_2026.png',
          uploadDate: '2026-03-10',
        },
        {
          id: 'mock-pt1-img2',
          patientId: '1',
          type: 'intraoral',
          url: '/intraoral.png',
          filename: 'intraoral_front.png',
          uploadDate: '2026-03-10',
        }
      ],
      addImage: (image) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          images: [{ ...image, id, uploadDate: new Date().toISOString().split('T')[0] }, ...state.images],
        }));
      },
      removeImage: (id) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
        })),
    }),
    {
      name: 'imrs-image-storage',
    }
  )
);
