const OPS: Record<string, (a: number, b: number) => number> = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "^": Math.pow,
};

export function evalPostfix(expr: string): number {
  const stack: number[] = [];
  for (const t of expr.trim().split(/\s+/)) {
    if (t in OPS) {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error("bad");
      stack.push(OPS[t](a, b));
    } else {
      const n = Number(t);
      if (isNaN(n)) throw new Error("bad");
      stack.push(n);
    }
  }
  if (stack.length !== 1) throw new Error("bad");
  return stack[0];
}

export function evalPrefix(expr: string): number {
  const stack: number[] = [];
  for (const t of expr.trim().split(/\s+/).reverse()) {
    if (t in OPS) {
      const a = stack.pop();
      const b = stack.pop();
      if (a === undefined || b === undefined) throw new Error("bad");
      stack.push(OPS[t](a, b));
    } else {
      const n = Number(t);
      if (isNaN(n)) throw new Error("bad");
      stack.push(n);
    }
  }
  if (stack.length !== 1) throw new Error("bad");
  return stack[0];
}
