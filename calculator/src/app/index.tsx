import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { evaluate, format } from "mathjs";
import { evalPostfix, evalPrefix } from "@/lib/rpn";
import { addHistory } from "@/lib/history";

type Mode = "infix" | "postfix" | "prefix";
const MODES: Mode[] = ["infix", "postfix", "prefix"];

const ROWS = [
  ["C", "⌫", "(", ")"],
  ["sin", "cos", "tan", "^"],
  ["√", "ln", "log", "/"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "␣", "="],
];

const FUNCS = ["sin", "cos", "tan", "√", "ln", "log"];

const CONVERSIONS = [
  { label: "°C→°F", fn: (n: number) => (n * 9) / 5 + 32 },
  { label: "°F→°C", fn: (n: number) => ((n - 32) * 5) / 9 },
  { label: "°C→K", fn: (n: number) => n + 273.15 },
  { label: "K→°C", fn: (n: number) => n - 273.15 },
];

export default function HomeScreen() {
  const [expr, setExpr] = useState("");
  const [mode, setMode] = useState<Mode>("infix");

  const finish = (shownExpr: string, value: unknown) => {
    if (typeof value !== "number" || !isFinite(value)) throw new Error("bad");
    const out = format(value, { precision: 10 });
    addHistory({ expr: shownExpr, result: out, mode, time: Date.now() });
    setExpr(out);
  };

  const calculate = () => {
    if (!expr.trim()) return;
    try {
      const clean = expr.replace(/x/g, "*");
      if (mode === "postfix") return finish(expr, evalPostfix(clean));
      if (mode === "prefix") return finish(expr, evalPrefix(clean));

      let e = clean
        .replace(/√/g, "sqrt")
        .replace(/log\(/g, "log10(") // our "log" = base 10
        .replace(/ln\(/g, "log("); // mathjs "log" = natural log
      const open = (e.match(/\(/g) || []).length;
      const close = (e.match(/\)/g) || []).length;
      e += ")".repeat(Math.max(0, open - close));
      finish(expr, evaluate(e));
    } catch {
      setExpr("Error");
    }
  };

  const convert = (label: string, fn: (n: number) => number) => {
    const n = Number(expr);
    if (!expr.trim() || isNaN(n)) return setExpr("Error");
    try {
      finish(`${expr} ${label}`, fn(n));
    } catch {
      setExpr("Error");
    }
  };

  const onPress = (key: string) => {
    const base = expr === "Error" ? "" : expr;
    if (key === "C") return setExpr("");
    if (key === "⌫") return setExpr(base.slice(0, -1));
    if (key === "=") return calculate();
    if (key === "␣") return setExpr(base + " ");
    if (FUNCS.includes(key)) {
      if (mode !== "infix") return; // functions only work in infix mode
      return setExpr(base + key + "(");
    }
    setExpr(base + key);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.modes}>
        {MODES.map((m) => (
          <Pressable
            key={m}
            onPress={() => {
              setMode(m);
              setExpr("");
            }}
            style={[styles.chip, mode === m && styles.chipActive]}
          >
            <Text style={styles.chipText}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.display}>
        <Text style={styles.displayText} numberOfLines={2} adjustsFontSizeToFit>
          {expr || "0"}
        </Text>
      </View>

      <View style={styles.row}>
        {CONVERSIONS.map((c) => (
          <Pressable
            key={c.label}
            onPress={() => convert(c.label, c.fn)}
            style={[styles.btn, styles.btnSmall]}
          >
            <Text style={styles.smallText}>{c.label}</Text>
          </Pressable>
        ))}
      </View>

      {ROWS.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              onPress={() => onPress(key)}
              style={({ pressed }) => [
                styles.btn,
                key === "=" && styles.btnEqual,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.btnText}>{key}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111", padding: 16, gap: 10 },
  modes: { flexDirection: "row", gap: 8, justifyContent: "center" },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
  },
  chipActive: { backgroundColor: "#4f7cff" },
  chipText: { color: "#fff", fontSize: 14 },
  display: { flex: 1, justifyContent: "flex-end", alignItems: "flex-end" },
  displayText: { color: "#fff", fontSize: 44 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSmall: { height: 40, backgroundColor: "#3b3b52" },
  btnEqual: { backgroundColor: "#4f7cff" },
  btnText: { color: "#fff", fontSize: 22 },
  smallText: { color: "#fff", fontSize: 14 },
});
