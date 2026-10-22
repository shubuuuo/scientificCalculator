# Scientific Calculator

A scientific calculator for Android built with **React Native and Expo**. It evaluates expressions in **infix, postfix and prefix** notation, converts temperatures, and keeps a persistent calculation history in a separate tab.

The project started as a C++ console calculator for a 2nd-semester **Data Structures** course, where the professor also asked for it to be turned into an app. That part was left undone at the time. This repository contains both the original C++ implementation and the finished mobile app, completed in 5th semester.

---

## Repository structure

```
.
├── calculator/           # React Native (Expo) mobile app
└── original cpp code/    # Original C++ console implementation
```

---

## Features

| Category | Details |
|---|---|
| Arithmetic | Addition, subtraction, multiplication, division, brackets |
| Scientific functions | Power (`^`), square root (`√`), natural log (`ln`), base-10 log (`log`), `sin`, `cos`, `tan` (angles in radians) |
| Expression modes | **Infix** (`2 + 3 * 4`), **Postfix** (`5 3 + 2 *`), **Prefix** (`* + 5 3 2`) |
| Temperature conversion | °C → °F, °F → °C, °C → K, K → °C |
| History | Every calculation is saved on the device (last 50) and shown in its own tab, with a Clear option |
| Error handling | Division by zero, invalid input and unsupported results show `Error` instead of crashing |

---

## Tech stack

| Purpose | Technology |
|---|---|
| Framework | React Native with Expo (SDK 57), TypeScript |
| Navigation | Expo Router (tab navigator) |
| Expression parsing (infix) | [mathjs](https://mathjs.org/) |
| Local storage | `@react-native-async-storage/async-storage` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Builds | EAS Build (Expo Application Services) |

No backend or database is needed. Everything runs on the device.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/)
- The **Expo Go** app on your Android phone (for live testing)

### Run the app

```bash
cd calculator
pnpm install
pnpm expo start
```

Scan the QR code with Expo Go to open the app on your phone.

### Build an APK

```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview
```

The `preview` profile in `eas.json` is configured to produce an installable `.apk`. When the build finishes, download the file from the link printed in the terminal.

### Install a ready-made APK

Download the latest `.apk` from the **Releases** page of this repository, open it on your Android phone, and allow installation from your browser or file manager when asked.

---

## Usage

**Infix mode** (default): type the expression and press `=`.

```
2 ^ 3 + sin(0)      →  8
√(16) + log(100)    →  6
```

**Postfix mode:** separate every number and operator with the space key (`␣`).

```
5 3 + 2 *           →  16
```

**Prefix mode:** operator first, then its operands.

```
* + 5 3 2           →  16
```

**Temperature conversion:** evaluate your value so the display shows a single number, then tap one of the conversion buttons.

---

## App structure

```
calculator/
├── app/
│   ├── _layout.tsx     # Tab navigator (Calculator, History)
│   ├── index.tsx       # Calculator screen
│   └── history.tsx     # History screen
├── lib/
│   ├── rpn.ts          # Postfix and prefix evaluators
│   └── history.ts      # Save, load and clear history (AsyncStorage)
├── app.json
└── eas.json
```

---

## Original C++ implementation

The `original cpp code/` folder holds the console program submitted for the Data Structures course. It uses a menu-driven interface and covers:

- **Classes and inheritance:** `BasicCalculator` as the base class and `ScientificCalculator` as the derived class
- **Function overloading and overriding:** overloaded `power()` and an overridden `display()`
- **Stack-based algorithms:**
  - infix → postfix conversion (operator precedence and brackets)
  - infix → prefix conversion
  - postfix, prefix and infix expression evaluation
- **Scientific functions and temperature conversions**

To compile and run it:

```bash
cd "original cpp code"
g++ -std=c++11 code.cpp -o calculator
./calculator
```

### From C++ to React Native

| C++ implementation | Mobile app |
|---|---|
| `evaluatePostfix`, `evaluatePrefix` (stack of `double`) | `lib/rpn.ts` (same stack logic in TypeScript) |
| `evaluateInfix` with `infixToPostfix` | Handled by mathjs's `evaluate` |
| `add`, `subtract`, `multiply`, `divide` | Operator keys `+ - x /` |
| `power`, `squareRoot`, `logarithm` | `^`, `√`, `ln` / `log` |
| `sine`, `cosine`, `tangent` | `sin`, `cos`, `tan` |
| Temperature conversion methods | Conversion buttons |
| Classes, inheritance, overloading | Not needed in a React component model |

Two intentional differences:

- `infixToPostfix` and `infixToPrefix` exist only in the C++ version. The app delegates infix evaluation to mathjs rather than reimplementing the conversion.
- `log` in the app is base 10 and `ln` is the natural logarithm, whereas C++'s `log()` is natural. Division by zero shows `Error` rather than returning `0`.

---

## Known limitations

- Function keys (`sin`, `√`, `ln`, …) work in infix mode only. Postfix and prefix modes support `+ - x / ^`.
- Trigonometric functions use radians.
- Only Android builds are provided.
- History is stored locally on the device and is not synced.

---

## Author

**Your Name**
[GitHub](https://github.com/shubuuuo)