import { parseLatex } from "../lib/latex-parser";
import assert from "assert";

console.log("Running LaTeX Parser Tests...");

// Test 1: Basic Arithmetic
const t1 = parseLatex("1 + 2");
assert.strictEqual(t1.expression.replace(/\s/g, ''), "1+2", "Test 1 Failed");
console.log("✅ Basic Arithmetic");

// Test 2: Fractions
const node2 = require("tex-math-parser").parseTex("\\frac{1}{2}");
console.log("Fraction JSON:", JSON.stringify(node2, null, 2));
const t2 = parseLatex("\\frac{1}{2}");
console.log("Fraction output:", t2.expression);
// MathJS toString might output "1 / 2"
assert.ok(t2.expression.includes("1") && t2.expression.includes("2") && t2.expression.includes("/"), "Test 2 Failed");
console.log("✅ Fractions");

// Test 3: Trig
const t3 = parseLatex("\\sin(x)");
assert.strictEqual(t3.expression, "sin(x)", "Test 3 Failed");
console.log("✅ Trig");

// Test 4: Implicit Multiplication
const t4 = parseLatex("2x");
assert.ok(t4.expression === "2 * x" || t4.expression === "2 x", "Test 4 Failed: " + t4.expression);
console.log("✅ Implicit Multiplication");

// Test 5: Error Handling
const t5 = parseLatex("\\invalidcommand");
assert.ok(t5.error !== null, "Test 5 Failed");
console.log("✅ Error Handling");

console.log("🎉 All Tests Passed!");
