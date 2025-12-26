import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseLatex } from "@/lib/latex-parser";

export interface Equation {
  id: string;
  type: "function" | "parametric";
  latex: string; // Used for y=f(x) or x(t)
  latexY?: string; // Used for y(t) in parametric
  expression: string; // Parsed MathJS string
  expressionY?: string; // Parsed MathJS string for Y
  tBounds?: [number, number]; // [min, max] for parametric
  color: string;
  visible: boolean;
  error?: string | null;
}

interface CalculatorState {
  equations: Equation[];
  addEquation: (equation: Partial<Equation>) => void;
  removeEquation: (id: string) => void;
  updateEquation: (id: string, updates: Partial<Equation>) => void;
  setEquations: (equations: Partial<Equation>[]) => void;
  showGrid: boolean;
  toggleGrid: () => void;
}

const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#f59e0b", "#10b981"];

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      equations: [
        {
          id: "1",
          type: "function",
          latex: "sin(x)",
          expression: "sin(x)",
          color: COLORS[0],
          visible: true,
          error: null,
        },
        {
          id: "2",
          type: "parametric",
          latex: "cos(t) * 3",
          latexY: "sin(t) * 3",
          expression: "cos(t) * 3",
          expressionY: "sin(t) * 3",
          tBounds: [0, 2 * Math.PI],
          color: COLORS[1],
          visible: true,
          error: null,
        }
      ],
      addEquation: (eq) =>
        set((state) => ({
          equations: [
            ...state.equations,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: "function",
              latex: "",
              latexY: "",
              expression: "",
              expressionY: "",
              tBounds: eq.type === "parametric" ? [0, 2 * Math.PI] : undefined,
              color: COLORS[state.equations.length % COLORS.length],
              visible: true,
              error: null,
              ...eq,
            },
          ],
        })),
      removeEquation: (id) =>
        set((state) => ({
          equations: state.equations.filter((e) => e.id !== id),
        })),
      updateEquation: (id, updates) =>
        set((state) => {
          const equations = state.equations.map((e) => {
            if (e.id !== id) return e;

            const newEquation = { ...e, ...updates };

            if (updates.latex !== undefined) {
                const result = parseLatex(updates.latex);
                newEquation.expression = result.expression;
                newEquation.error = result.error;
            }

            if (updates.latexY !== undefined) {
                 const result = parseLatex(updates.latexY);
                 newEquation.expressionY = result.expression;
                 if (result.error) {
                     newEquation.error = result.error;
                 } else if (updates.latex === undefined && !newEquation.error) {
                     newEquation.error = null;
                 }
            }
            
            return newEquation;
          });
          return { equations };
        }),
      setEquations: (newEquations) =>
        set(() => ({
          equations: newEquations.map((eq, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            latex: "",
            expression: "",
            color: COLORS[i % COLORS.length],
            visible: true,
            type: "function",
            error: null,
            ...eq,
          })),
        })),
      showGrid: true,
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    }),
    {
      name: "webcal-storage",
    }
  )
);
