import { Equation } from "@/store/useCalculatorStore";

export interface Preset {
  id: string;
  name: string;
  description: string;
  type: "function" | "parametric";
  equations: Partial<Equation>[];
}

export const PRESETS: Preset[] = [
  {
    id: "basic",
    name: "Standard Set",
    description: "Common high-school functions.",
    type: "function",
    equations: [
      { type: "function", expression: "sin(x)", latex: "sin(x)", color: "#3b82f6", visible: true },
      { type: "function", expression: "x^2", latex: "x^2", color: "#a855f7", visible: true },
    ],
  },
  {
    id: "physics-waves",
    name: "Wave Packet",
    description: "Interference and damping patterns.",
    type: "function",
    equations: [
      { type: "function", expression: "sin(x) * exp(-0.1 * x)", latex: "", color: "#ec4899", visible: true },
      { type: "function", expression: "sin(x) + sin(1.1 * x)", latex: "", color: "#f59e0b", visible: true },
    ],
  },
  {
    id: "lissajous",
    name: "Lissajous Figure",
    description: "Complex harmonic motion.",
    type: "parametric",
    equations: [
      { 
        type: "parametric", 
        expression: "3 * sin(3 * t)", 
        expressionY: "3 * sin(2 * t)", 
        latex: "", 
        color: "#10b981", 
        visible: true 
      },
    ],
  },
  {
    id: "spiral",
    name: "Archimedean Spiral",
    description: "A spiral moving outward.",
    type: "parametric",
    equations: [
      { 
        type: "parametric", 
        expression: "0.5 * t * cos(t)", 
        expressionY: "0.5 * t * sin(t)", 
        latex: "", 
        color: "#f43f5e", 
        visible: true 
      },
    ],
  },
    {
    id: "flower",
    name: "Polar Rose",
    description: "A rose curve converted to parametric form.",
    type: "parametric",
    equations: [
      { 
        type: "parametric", 
        expression: "3 * cos(4*t) * cos(t)", 
        expressionY: "3 * cos(4*t) * sin(t)", 
        latex: "", 
        color: "#8b5cf6", 
        visible: true 
      },
    ],
  },
];
