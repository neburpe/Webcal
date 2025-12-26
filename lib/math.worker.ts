import { compile } from "mathjs";

/**
 * The worker listens for requests to evaluate expressions over a range.
 */
self.onmessage = (e: MessageEvent) => {
  const { id, expression, range, steps, variable = "x" } = e.data;

  try {
    const node = compile(expression);
    const [min, max] = range;
    const step = (max - min) / steps;
    
    const xValues = new Float64Array(steps + 1);
    const yValues = new Float64Array(steps + 1);

    for (let i = 0; i <= steps; i++) {
      const v = min + i * step;
      const scope = { [variable]: v };
      xValues[i] = v;
      yValues[i] = node.evaluate(scope);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    self.postMessage({ id, xValues, yValues }, [xValues.buffer, yValues.buffer] as any);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Evaluation error";
    self.postMessage({ id, error: message });
  }
};
