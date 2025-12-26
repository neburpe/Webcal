"use client";

import { useCalculatorStore, Equation } from "@/store/useCalculatorStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, Settings2, FunctionSquare, Variable, Sparkles } from "lucide-react";

import { PresetGallery } from "./PresetGallery";
import { useState } from "react";

export function Sidebar() {
  const { equations, addEquation, showGrid, toggleGrid } = useCalculatorStore();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <PresetGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-neutral-900 border-r border-neutral-800 z-10 flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Webcal
            </h1>
            <p className="text-neutral-500 text-xs mt-1 uppercase tracking-tighter font-semibold">Technical Fellow Edition</p>
          </div>
          <button 
            onClick={() => setIsGalleryOpen(true)}
            title="Open Gallery"
            className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-yellow-400 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Expressions</span>
            <div className="flex gap-1">
                 <button 
                    onClick={() => addEquation({ type: "function", expression: "" })}
                    title="Add Function"
                    className="p-1 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-all"
                >
                    <FunctionSquare className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => addEquation({ type: "parametric", expression: "", expressionY: "" })}
                    title="Add Parametric"
                    className="p-1 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-all"
                >
                    <Variable className="w-4 h-4" />
                </button>
            </div>
        </div>

        <AnimatePresence initial={false}>
          {equations.map((eq) => (
            <EquationItem key={eq.id} equation={eq} />
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <button 
          onClick={toggleGrid}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
            showGrid 
            ? "bg-neutral-800 border-neutral-700 text-neutral-200" 
            : "bg-transparent border-neutral-800 text-neutral-500"
          }`}
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
      </div>
    </motion.div>
    </>
  );
}

function EquationItem({ equation }: { equation: Equation }) {
  const { updateEquation, removeEquation } = useCalculatorStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-neutral-800/40 hover:bg-neutral-800/70 border border-neutral-800/50 rounded-2xl p-4 transition-all"
    >
      <div className="flex items-start gap-3 mb-2">
        <div 
          className="w-3 h-3 rounded-full shrink-0 mt-1.5 shadow-[0_0_10px_var(--color)]"
          style={{ backgroundColor: equation.color, "--color": equation.color } as any}
        />
        
        <div className="flex-1 space-y-2">
            {equation.type === "function" ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono text-xs">y =</span>
                        <input
                            type="text"
                            value={equation.latex}
                            onChange={(e) => updateEquation(equation.id, { latex: e.target.value })}
                            placeholder="sin(x)"
                            className="bg-transparent border-none outline-none flex-1 text-neutral-100 font-mono text-sm placeholder:text-neutral-600"
                        />
                    </div>
                    {equation.error && (
                        <p className="text-[10px] text-red-400 pl-6">{equation.error}</p>
                    )}
                </div>
            ) : (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono text-xs">x(t) =</span>
                        <input
                            type="text"
                            value={equation.latex}
                            onChange={(e) => updateEquation(equation.id, { latex: e.target.value })}
                            placeholder="cos(t)"
                            className="bg-transparent border-none outline-none flex-1 text-neutral-100 font-mono text-sm placeholder:text-neutral-600"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono text-xs">y(t) =</span>
                        <input
                            type="text"
                            value={equation.latexY || ""}
                            onChange={(e) => updateEquation(equation.id, { latexY: e.target.value })}
                            placeholder="sin(t)"
                            className="bg-transparent border-none outline-none flex-1 text-neutral-100 font-mono text-sm placeholder:text-neutral-600"
                        />
                    </div>
                    {equation.error && (
                        <p className="text-[10px] text-red-400 pl-8">{equation.error}</p>
                    )}
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 h-6">
        <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest ml-6">
            {equation.type}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => updateEquation(equation.id, { visible: !equation.visible })}
                className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-neutral-200 transition-colors"
            >
                {equation.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button 
                onClick={() => removeEquation(equation.id)}
                className="p-1.5 hover:bg-red-950/30 rounded-lg text-neutral-500 hover:text-red-400 transition-colors"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>
    </motion.div>
  );
}