import { compile } from "mathjs";

/**
 * Compiles a string expression into a function that takes x and returns y.
 * Returns null if the expression is invalid.
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
