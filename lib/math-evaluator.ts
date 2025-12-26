import { compile } from "mathjs";

/**
 * Compiles a string expression into a function that takes x and returns y.
 * This is used for real-time Mafs rendering (synchronous).
 */
export function createEvaluator(expression: string, variable: "x" | "t" = "x"): ((val: number) => number) | null {
  try {
    const node = compile(expression);
    return (val: number) => {
      try {
        const scope: Record<string, number> = {};
        scope[variable] = val;
        return node.evaluate(scope);
      } catch {
        return NaN;
      }
    };
  } catch {
    return null;
  }
}

/**
 * Interface for the result of a worker evaluation.
 */
export interface WorkerResult {
  xValues: Float64Array;
  yValues: Float64Array;
}

/**
 * Logic for interacting with the Web Worker will go here in future iterations
 * to support heavy pre-calculation of high-density plots.
 */