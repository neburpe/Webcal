"use client";

import { Mafs, Coordinates, Plot, Inequality } from "mafs";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { createEvaluator } from "@/lib/math-evaluator";
import { useMemo, useRef, useState, useEffect } from "react";

export function GraphCanvas() {
  const { equations, showGrid } = useCalculatorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setSize({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    
    // Initial size
    setSize({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    return () => observer.disconnect();
  }, []);

  const renderedPlots = useMemo(() => {
    return equations
      .filter((eq) => eq.visible)
      .map((eq) => {
        if (eq.type === "function") {
          if (!eq.expression.trim()) return null;
          const fn = createEvaluator(eq.expression, "x");
          if (!fn) return null;

          if (eq.inequalityOp) {
              return (
                <Inequality
                    key={eq.id}
                    y={fn}
                    lessThan={eq.inequalityOp === "<" || eq.inequalityOp === "<="}
                    lessThanOrEqualTo={eq.inequalityOp === "<="}
                    greaterThan={eq.inequalityOp === ">" || eq.inequalityOp === ">="}
                    greaterThanOrEqualTo={eq.inequalityOp === ">="}
                    color={eq.color}
                />
              );
          }

          return (
            <Plot.OfX
              key={eq.id}
              y={fn}
              color={eq.color}
              weight={3}
            />
          );
        } else if (eq.type === "parametric") {
          if (!eq.expression.trim() || !eq.expressionY?.trim()) return null;
          const fnX = createEvaluator(eq.expression, "t");
          const fnY = createEvaluator(eq.expressionY, "t");
          if (!fnX || !fnY) return null;
          return (
            <Plot.Parametric
              key={eq.id}
              xy={(t) => [fnX(t), fnY(t)]}
              t={eq.tBounds || [0, 2 * Math.PI]}
              color={eq.color}
              weight={3}
            />
          );
        }
        return null;
      });
  }, [equations]);

  return (
    <div ref={containerRef} className="flex-1 relative h-full w-full bg-black overflow-hidden">
      {size.width > 0 && (
        <Mafs 
          width={size.width} 
          height={size.height} 
          zoom={{ min: 0.1, max: 10 }} 
          pan={true}
        >
          <Coordinates.Cartesian subdivisions={showGrid ? 2 : false} />
          {renderedPlots}
        </Mafs>
      )}
      
      <div className="absolute top-6 right-6 flex gap-2">
        <div className="bg-neutral-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 text-xs text-neutral-400 font-medium">
          Engine: Mafs + MathJS
        </div>
      </div>
    </div>
  );
}
