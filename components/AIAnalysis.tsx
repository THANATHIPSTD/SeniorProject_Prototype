'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Play, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// We'll use a CSS gradient as a placeholder for a panoramic x-ray

export default function AIAnalysis() {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');

    const runAnalysis = () => {
        setStatus('scanning');
        // Simulate API delay
        setTimeout(() => {
            setStatus('complete');
        }, 3000);
    };

    const reset = () => {
        setStatus('idle');
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <BrainCircuit className="w-5 h-5" />
                        </div>
                        AI Diagnostic Simulation
                    </h2>
                    <p className="text-slate-500 mt-1">Panoramic radiographic analysis for bone loss and CEJ mapping.</p>
                </div>

                {status === 'complete' ? (
                    <button onClick={reset} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        Reset Scan
                    </button>
                ) : (
                    <button
                        onClick={runAnalysis}
                        disabled={status === 'scanning'}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm",
                            status === 'scanning'
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-4 focus:ring-indigo-600/20"
                        )}
                    >
                        {status === 'scanning' ? (
                            <span className="flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 animate-pulse" />
                                Analyzing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Run AI Analysis
                            </span>
                        )}
                    </button>
                )}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* X-Ray Viewport */}
                <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Panoramic View</span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                        </div>
                    </div>

                    <div className={cn("flex-1 rounded-xl relative overflow-hidden flex items-center justify-center bg-slate-900 border-4 border-slate-950")}>
                        {/* Real X-Ray image wrapper */}
                        <img src="/Paronamic.png" alt="Panoramic Scan" className="w-full h-full object-cover opacity-80" />
                        
                        {/* Overlay to dim before analysis completes */}
                        <div className={cn(
                            "absolute inset-0 bg-slate-900/40 transition-opacity duration-1000",
                            status === 'complete' ? "opacity-0" : "opacity-100"
                        )} />

                        {status === 'idle' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="z-10 text-white font-bold tracking-widest text-xl uppercase bg-slate-900/60 px-6 py-3 rounded-xl backdrop-blur-md">Click Run Analysis</div>
                            </div>
                        )}

                        {/* Scanning Overlay (Framer Motion) */}
                        <AnimatePresence>
                            {status === 'scanning' && (
                                <motion.div
                                    initial={{ left: '-10%' }}
                                    animate={{ left: '110%' }}
                                    transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                                    className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-20 border-r-2 border-cyan-400"
                                />
                            )}
                        </AnimatePresence>

                        {/* Diagnostic Overlays appear after scan */}
                        <AnimatePresence>
                            {status === 'complete' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 z-10"
                                >
                                    {/* Fake CEJ Line */}
                                    <div className="absolute top-[42%] left-[10%] right-[10%] h-px bg-green-400/80 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">
                                        <span className="absolute -top-6 left-0 text-[10px] font-bold text-green-400">CEJ Line</span>
                                    </div>
                                    {/* Fake Bone Level */}
                                    <div className="absolute top-[52%] left-[10%] right-[10%] h-[2px] bg-red-500/80 break-words drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] border-dashed border-red-500">
                                        <span className="absolute top-2 left-0 text-[10px] font-bold text-red-400">Alveolar Bone Level (Class II Loss)</span>
                                    </div>

                                    {/* Highlight boxes */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
                                        className="absolute top-[45%] left-[65%] w-16 h-20 border-2 border-amber-400 bg-amber-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
                                    >
                                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Output Diagnostics Card */}
                <div className="relative">
                    <AnimatePresence>
                        {status === 'complete' ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-y-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        <h3 className="text-lg font-bold text-slate-800">Analysis Results</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Crown-to-Root Ratio</div>
                                            <div className="flex items-end gap-3">
                                                <span className="text-3xl font-black text-slate-800">1:1.2</span>
                                                <span className="text-sm font-medium text-amber-500 mb-1">Suboptimal</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Mobility Risk</div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden flex">
                                                    <div className="h-full bg-red-500 w-2/3 rounded-full"></div>
                                                </div>
                                                <span className="text-sm font-bold text-red-500">High</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">Significant generalized horizontal bone loss detected in mandibular anterior region.</p>
                                        </div>

                                        <div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Tooth Prognosis Overview</div>
                                            <div className="space-y-2">
                                                <div className="flexjustify-between items-center p-3 rounded-lg border border-red-200 bg-red-50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded bg-white text-red-600 font-bold flex items-center justify-center text-xs shadow-sm shadow-red-100">41</span>
                                                        <span className="text-sm font-semibold text-red-900">Poor / Hopeless</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center p-3 rounded-lg border border-amber-200 bg-amber-50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded bg-white text-amber-600 font-bold flex items-center justify-center text-xs shadow-sm shadow-amber-100">31</span>
                                                        <span className="text-sm font-semibold text-amber-900">Questionable</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full mt-8 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                        Add to Charting Record
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="absolute inset-0 bg-slate-100/50 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center p-6">
                                <BrainCircuit className="w-12 h-12 text-slate-300 mb-4" />
                                <h3 className="font-semibold text-slate-400">Awaiting Submissions</h3>
                                <p className="text-sm text-slate-400 mt-2">Run the AI analysis on the panoramic image to generate diagnostic metrics.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
