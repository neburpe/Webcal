"use client";

import { PRESETS } from "@/lib/presets";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useState } from "react";

export function PresetGallery({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { setEquations } = useCalculatorStore();

  const handleSelect = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setEquations(preset.equations);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Example Gallery
                  </h2>
                  <p className="text-neutral-400 text-sm mt-1">
                    Select a preset to load into the calculator.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelect(preset.id)}
                    className="flex flex-col items-start text-left p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-neutral-600 transition-all group"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                        <span className="font-semibold text-neutral-200 group-hover:text-white transition-colors">
                            {preset.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 bg-neutral-900/50 px-2 py-1 rounded-md">
                            {preset.type}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
