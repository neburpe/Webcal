import { parseTex } from "tex-math-parser";

export interface ParseResult {
  expression: string;
  error: string | null;
}

/**
 * Parses a LaTeX string into a MathJS compatible expression.
 * @param latex The LaTeX string to parse.
 * @returns An object containing the parsed expression string or an error message.
 */
export function parseLatex(latex: string): ParseResult {
  if (!latex || !latex.trim()) {
    return { expression: "", error: null };
  }

  try {
    // parseTex returns a MathJS node tree. We convert it to a string.
    const node = parseTex(latex);
    
    // Sanitize operators that might be left as TeX commands (e.g. \frac)
    const sanitized = node.transform(function (node: any) {
        if (node.isOperatorNode && node.op === '\\frac') {
            node.op = '/';
        }
        if (node.isOperatorNode && node.op === '\\cdot') {
            node.op = '*';
        }
        return node;
    });

    return { expression: sanitized.toString(), error: null };
  } catch (e: any) {
    return { expression: "", error: e.message || "Invalid LaTeX" };
  }
}
