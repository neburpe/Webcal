"use client";

import { useCalculatorStore, Equation } from "@/store/useCalculatorStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Eye, EyeOff, FunctionSquare, Variable, Sparkles, ChevronLeft, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { PresetGallery } from "./PresetGallery";
import { useState, CSSProperties, useEffect } from "react";

export function Sidebar() {
  const { equations, addEquation, showGrid, toggleGrid } = useCalculatorStore();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <>
      <PresetGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
      
      {/* Toggle Button (Visible when collapsed) */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsCollapsed(false)}
            className="absolute top-4 left-4 z-50 p-2 bg-panel-bg/80 backdrop-blur-md border border-border-subtle rounded-lg text-text-dim hover:text-text-main transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ x: 0, width: 320 }}
        animate={{ 
            x: isCollapsed ? -320 : 0,
            width: 320,
            opacity: isCollapsed ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full bg-panel-bg border-r border-border-subtle z-10 flex flex-col shadow-2xl overflow-hidden relative"
      >
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Webcal
            </h1>
            <p className="text-text-dim text-xs mt-1 uppercase tracking-tighter font-semibold">Technical Fellow Edition</p>
          </div>
          <div className="flex items-center gap-1">
            <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-app-bg/10 rounded-lg text-text-dim hover:text-text-main transition-colors"
            >
                {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            </button>
            <button 
                onClick={() => setIsGalleryOpen(true)}
                title="Open Gallery"
                className="p-2 hover:bg-app-bg/10 rounded-lg text-text-dim hover:text-yellow-500 transition-colors"
            >
                <Sparkles className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setIsCollapsed(true)}
                title="Collapse Sidebar"
                className="p-2 hover:bg-app-bg/10 rounded-lg text-text-dim hover:text-text-main transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold text-text-dim uppercase tracking-widest">Expressions</span>
            <div className="flex gap-1">
                 <button 
                    onClick={() => addEquation({ type: "function", expression: "" })}
                    title="Add Function"
                    className="p-1 hover:bg-app-bg/10 rounded-md text-text-dim hover:text-text-main transition-all"
                >
                    <FunctionSquare className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => addEquation({ type: "parametric", expression: "", expressionY: "" })}
                    title="Add Parametric"
                    className="p-1 hover:bg-app-bg/10 rounded-md text-text-dim hover:text-text-main transition-all"
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

      <div className="p-4 border-t border-border-subtle bg-panel-bg/50 backdrop-blur-sm">
        <button 
          onClick={toggleGrid}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border ${
            showGrid 
            ? "bg-app-bg border-border-subtle text-text-main" 
            : "bg-transparent border-border-subtle text-text-dim"
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
      className="group bg-app-bg/40 hover:bg-app-bg/70 border border-border-subtle rounded-2xl p-4 transition-all"
    >
      <div className="flex items-start gap-3 mb-2">
        <div 
          className="w-3 h-3 rounded-full shrink-0 mt-1.5 shadow-[0_0_10px_var(--color)]"
          style={{ backgroundColor: equation.color, "--color": equation.color } as CSSProperties}
        />
        
        <div className="flex-1 space-y-2">
            {equation.type === "function" ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-text-dim font-mono text-xs">y =</span>
                        <input
                            type="text"
                            value={equation.latex}
                            onChange={(e) => updateEquation(equation.id, { latex: e.target.value })}
                            placeholder="sin(x)"
                            className="bg-transparent border-none outline-none flex-1 text-text-main font-mono text-sm placeholder:text-text-dim/50"
                        />
                    </div>
                    {equation.error && (
                        <p className="text-[10px] text-red-500 pl-6">{equation.error}</p>
                    )}
                </div>
            ) : (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-text-dim font-mono text-xs">x(t) =</span>
                        <input
                            type="text"
                            value={equation.latex}
                            onChange={(e) => updateEquation(equation.id, { latex: e.target.value })}
                            placeholder="cos(t)"
                            className="bg-transparent border-none outline-none flex-1 text-text-main font-mono text-sm placeholder:text-text-dim/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-text-dim font-mono text-xs">y(t) =</span>
                        <input
                            type="text"
                            value={equation.latexY || ""}
                            onChange={(e) => updateEquation(equation.id, { latexY: e.target.value })}
                            placeholder="sin(t)"
                            className="bg-transparent border-none outline-none flex-1 text-text-main font-mono text-sm placeholder:text-text-dim/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 pl-10 pt-1">
                        <span className="text-[10px] text-text-dim font-mono">t:</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={equation.tBounds?.[0] ?? 0}
                                onChange={(e) => updateEquation(equation.id, { tBounds: [parseFloat(e.target.value) || 0, equation.tBounds?.[1] ?? 2 * Math.PI] })}
                                className="w-14 bg-app-bg/50 border border-border-subtle rounded px-1.5 py-0.5 text-[10px] text-text-main font-mono outline-none focus:border-text-dim/30"
                            />
                            <span className="text-[10px] text-text-dim font-bold">to</span>
                            <input
                                type="text"
                                value={equation.tBounds?.[1] ?? 6.28}
                                onChange={(e) => updateEquation(equation.id, { tBounds: [equation.tBounds?.[0] ?? 0, parseFloat(e.target.value) || 0] })}
                                className="w-14 bg-app-bg/50 border border-border-subtle rounded px-1.5 py-0.5 text-[10px] text-text-main font-mono outline-none focus:border-text-dim/30"
                            />
                        </div>
                    </div>
                    {equation.error && (
                        <p className="text-[10px] text-red-500 pl-8">{equation.error}</p>
                    )}
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 h-6">
        <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest ml-6">
            {equation.type}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => updateEquation(equation.id, { visible: !equation.visible })}
                className="p-1.5 hover:bg-app-bg/10 rounded-lg text-text-dim hover:text-text-main transition-colors"
            >
                {equation.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button 
                onClick={() => removeEquation(equation.id)}
                className="p-1.5 hover:bg-red-500/10 rounded-lg text-text-dim hover:text-red-500 transition-colors"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>
    </motion.div>
  );
}