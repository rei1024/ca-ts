# @ca-ts/algo

A fast cellular automaton simulation library for TypeScript, supporting various
rule types. This package provides `BitWorld`, an optimized simulator for 2-state
cellular automata, and `RuleLoaderWorld`, a flexible simulator for multi-state
and custom rules.

## Features

- **High Performance:** `BitWorld` is optimized for speed using bitwise
  operations.
- **Flexible:** `RuleLoaderWorld` supports multi-state automata and custom rule
  functions.
- **Multiple Rule Formats (for `BitWorld`):**
  - Conway's Game of Life (default)
  - Outer-totalistic rules (e.g., B36/S23 HighLife)
  - Isotropic non-totalistic rules (e.g., B2-a/S12 Just Friends)
  - Non-isotropic rules (MAP)

## Usage

### Conway's Game of Life

Here's a basic example of how to simulate Conway's Game of Life:

```ts
import { BitWorld } from "@ca-ts/algo/bit";
// from npm
// import { BitWorld } from "@rei1024/ca-algo/bit";

// Create a 32x32 world
const world = BitWorld.make({ width: 32, height: 32 });

// Fill the world with a random pattern
world.random();

// Run the simulation
setInterval(() => {
  console.clear();
  console.log("__".repeat(32));
  console.log(
    world.getArray().map((row) =>
      row.map((cell) => (cell === 1 ? "O " : "  ")).join("")
    ).join("\n"),
  );

  // Advance to the next generation
  world.next();
}, 100);
```

### Outer-Totalistic Rules (e.g., HighLife)

You can specify different rules for the simulation. For example, to simulate
"HighLife" (B36/S23):

```ts
import { BitWorld } from "@ca-ts/algo/bit";

const world = BitWorld.make({ width: 32, height: 32 });

// Set the rule to HighLife (B36/S23)
world.setRule({ birth: [3, 6], survive: [2, 3] });

world.random();

// ... (simulation loop)
```

### Isotropic Non-Totalistic Rules

The library also supports more complex isotropic non-totalistic rules.

```ts
import { BitWorld } from "@ca-ts/algo/bit";
import { parseRule } from "@ca-ts/rule";

const rule = parseRule("B2-a/S12"); // Just Friends
if (rule.type !== "int") throw new Error("Invalid rule type");

const world = BitWorld.make({ width: 32, height: 32 });

// Set the INT rule
world.setINTRule(rule.transition);

world.random();

// ... (simulation loop)
```

### Multi-State and Custom Rules (`RuleLoaderWorld`)

For cellular automata with more than 2 states, or with rules that cannot be
expressed in the formats supported by `BitWorld`, the `RuleLoaderWorld` class
provides a more flexible alternative. It takes a custom rule function that
determines the next state of a cell based on its 8 neighbors and its own state.

Here is an example of a 3-state cyclic cellular automaton:

```ts
import { RuleLoaderWorld } from "@ca-ts/algo/rule-loader";

const NUM_STATES = 3;
const THRESHOLD = 3;

const world = new RuleLoaderWorld({
  size: { width: 32, height: 32 },
  rule: (neighbors) => {
    const centerState = neighbors[0];
    const nextState = (centerState + 1) % NUM_STATES;

    let count = 0;
    // Count neighbors with the state that "eats" the current state
    for (let i = 1; i < neighbors.length; i++) {
      if (neighbors[i] === nextState) {
        count++;
      }
    }

    // If there are enough "predators", the cell changes state
    if (count >= THRESHOLD) {
      return nextState;
    }

    return centerState;
  },
});

// Initialize with random states
const { width, height } = world.getSize();
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    world.set(x, y, Math.floor(Math.random() * NUM_STATES));
  }
}

// Run the simulation
setInterval(() => {
  console.clear();
  console.log(
    world
      .getArray()
      .map((row) => row.map((cell) => ".:*"[cell]).join(""))
      .join("\n"),
  );
  world.next();
}, 100);
```
