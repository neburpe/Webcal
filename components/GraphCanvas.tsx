"use client";

import { Mafs, Coordinates, Plot } from "mafs";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { createEvaluator } from "@/lib/math-evaluator";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

export function GraphCanvas() {
  const { equations, showGrid } = useCalculatorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const exportImage = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
      });
      const link = document.createElement('a');
      link.download = `webcal-graph-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  }, [containerRef]);

  // Cache compiled functions to prevent re-compiling on every frame/pan
  const compiledCache = useMemo(() => {
    const cache = new Map<string, (val: number) => number>();
    equations.forEach(eq => {
      if (eq.expression) {
        const fn = createEvaluator(eq.expression, eq.type === "parametric" ? "t" : "x");
        if (fn) cache.set(`${eq.id}-main`, fn);
      }
      if (eq.expressionY) {
        const fn = createEvaluator(eq.expressionY, "t");
        if (fn) cache.set(`${eq.id}-y`, fn);
      }
    });
    return cache;
  }, [equations]);

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

            const fn = compiledCache.get(`${eq.id}-main`);

            if (!fn) return null;

  

                      if (eq.inequalityOp) {

  

                          return (

  

                            <Plot.Inequality

  

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

            const fnX = compiledCache.get(`${eq.id}-main`);

            const fnY = compiledCache.get(`${eq.id}-y`);

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

    }, [equations, compiledCache]);

  return (
    <div ref={containerRef} className="flex-1 relative h-full w-full bg-app-bg overflow-hidden transition-colors duration-300">
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
      
      <div className="absolute top-6 right-6 flex gap-2 items-center">
        <button 
            onClick={exportImage}
            title="Export to PNG"
            className="flex items-center gap-2 bg-panel-bg/80 backdrop-blur-md px-4 py-2 rounded-full border border-border-subtle text-xs text-text-dim font-medium hover:text-text-main hover:border-text-dim/30 transition-all shadow-lg"
        >
            <Download className="w-3.5 h-3.5" />
            Export PNG
        </button>
        <div className="bg-panel-bg/80 backdrop-blur-md px-4 py-2 rounded-full border border-border-subtle text-xs text-text-dim font-medium transition-colors">
          Engine: Mafs + MathJS
        </div>
      </div>
    </div>
  );
}
