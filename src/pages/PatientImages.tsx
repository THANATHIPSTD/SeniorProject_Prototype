
import { useState } from 'react';
import {  useParams, useNavigate  } from 'react-router-dom';
import { usePatientStore } from '@/store/usePatientStore';
import { useImageStore } from '@/store/useImageStore';
import { ArrowLeft, Upload, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageManagementPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { patients } = usePatientStore();
  const { images, addImage, removeImage } = useImageStore();
  
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const patient = patients.find((p) => p.id === idStr);

  const [activeTab, setActiveTab] = useState<'all' | 'intraoral' | 'panoramic'>('all');
  const [uploadType, setUploadType] = useState<'intraoral' | 'panoramic'>('intraoral');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!patient) return <div className="p-8">Patient not found</div>;

  const patientImages = images.filter((img) => img.patientId === patient.id);
  const filteredImages = activeTab === 'all' ? patientImages : patientImages.filter((img) => img.type === activeTab);

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      // Mock upload completion with a random placeholder image
      addImage({
        patientId: patient.id,
        type: uploadType,
        filename: `${uploadType}_scan_${Date.now()}.png`,
        url: uploadType === 'panoramic' ? `/Paronamic.png?random=${Date.now()}` : `/intraoral.png?random=${Date.now()}`
      });
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between shrink-0 shadow-sm z-10 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="p-2 h-auto text-slate-500" onClick={() => navigate(`/patients/${patient.id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              Radiographs & Photos
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{patient.name}</span>
              <span>•</span>
              <span>{patient.hn}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
             <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200/50 h-10">
               {(['intraoral', 'panoramic'] as const).map((type) => (
                 <button
                   key={type}
                   type="button"
                   onClick={() => setUploadType(type)}
                   className={`px-3 text-xs font-semibold rounded-md transition-all ${
                     uploadType === type
                       ? "bg-white text-teal-600 shadow-sm border border-slate-200/50"
                       : "text-slate-600 hover:text-slate-800"
                   }`}
                 >
                   {type === 'intraoral' ? 'Intraoral Photo' : 'Panoramic X-Ray'}
                 </button>
               ))}
             </div>
             <Button
                onClick={handleMockUpload}
                disabled={isUploading}
                className="bg-amber-500 hover:bg-amber-600 text-white"
             >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
             </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-6">
          
          {/* Tabs */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
            {(['all', 'panoramic', 'intraoral'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                {tab === 'all' ? 'All Images' : tab === 'panoramic' ? 'Panoramic X-Rays' : 'Intraoral Photos'}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.length === 0 ? (
               <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                 <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                 <p>No images found in this category.</p>
               </div>
            ) : (
                filteredImages.map((img) => (
                  <div key={img.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                    <div 
                      className="aspect-square relative cursor-pointer bg-slate-100"
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img 
                        src={img.url} 
                        alt={img.filename}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">View Full Image</span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{img.filename}</p>
                        <p className="text-xs text-slate-500 mt-1">{img.uploadDate} • <span className="uppercase text-amber-600">{img.type}</span></p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 shrink-0 h-8 w-8 p-0" onClick={() => removeImage(img.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
         <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
           <Button 
            variant="ghost" 
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 h-auto"
            onClick={() => setSelectedImage(null)}
           >
             <X className="w-6 h-6" />
           </Button>
           <img 
             src={selectedImage} 
             alt="Full screen preview" 
             className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
           />
         </div>
      )}
    </div>
  );
}
