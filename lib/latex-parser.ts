import { parseTex } from "tex-math-parser";

export interface ParseResult {
  expression: string;
  error: string | null;
  inequalityOp?: "<" | "<=" | ">" | ">=" | null;
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

  let cleanedLatex = latex;
  let inequalityOp: ParseResult["inequalityOp"] = null;

  // Simple inequality detection
  const ops: Array<NonNullable<ParseResult["inequalityOp"]>> = ["<=", ">=", "<", ">"];
  for (const op of ops) {
      if (latex.includes(op)) {
          inequalityOp = op;
          // We assume input like 'y < sin(x)' -> we just need 'sin(x)' for the plot
          const parts = latex.split(op);
          // Try to be smart: if it's 'y < expression', take the expression part
          if (parts[0].trim().toLowerCase() === 'y' || parts[0].trim().toLowerCase() === 'x') {
              cleanedLatex = parts[1].trim();
          } else {
              // If it's 'expression > 0', this is harder. For now, assume y < ...
              cleanedLatex = parts[0].trim();
          }
          break;
      }
  }

  try {
    // parseTex returns a MathJS node tree. We convert it to a string.
    const node = parseTex(cleanedLatex);
    
    // Sanitize operators that might be left as TeX commands (e.g. \frac)
    const sanitized = node.transform(function (node: { isOperatorNode?: boolean; op?: string }) {
        if (node.isOperatorNode && node.op === '\\frac') {
            node.op = '/';
        }
        if (node.isOperatorNode && node.op === '\\cdot') {
            node.op = '*';
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return node as any;
    });

    return { expression: sanitized.toString(), error: null, inequalityOp };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid LaTeX";
    return { expression: "", error: message, inequalityOp };
  }
}
