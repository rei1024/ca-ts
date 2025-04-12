# Cellular automaton simulation

## Game of Life

```ts ignore
import { BitWorld } from "@ca-ts/algo/bit";

// Simulate Conway's Game of Life
const world = BitWorld.make({ width: 32, height: 32 });

// Fill random state
world.random();

setInterval(() => {
  console.clear();
  console.log("__".repeat(32));
  console.log(
    world.getArray().map((row) =>
      row.map((x) => x === 1 ? "O " : "  ").join("")
    )
      .join("\n"),
  );
  // Next generation
  world.next();
}, 100);
```

## Outer-totalistic cellular automata

```ts ignore
import { BitWorld } from "@ca-ts/algo/bit";

const world = BitWorld.make(
  { width: 32, height: 32 },
  // B36/S23 HighLife
  { transition: { birth: [3, 6], survive: [2, 3] } },
);
world.random();
setInterval(() => {
  console.clear();
  console.log("__".repeat(32));
  console.log(
    world.getArray().map((row) =>
      row.map((x) => x === 1 ? "O " : "  ").join("")
    )
      .join("\n"),
  );
  world.next();
}, 100);
```

## Isotropic non-totalistic cellular automata

```ts ignore
import { BitWorld } from "@ca-ts/algo/bit";
import { parseRule } from "@ca-ts/rule";

const rule = parseRule("B2-a/S12"); // Just friends;
if (rule.type !== "int") throw new Error();
const world = BitWorld.make(
  { width: 32, height: 32 },
  { intTransition: rule.transition },
);
world.random();
setInterval(() => {
  console.clear();
  console.log("__".repeat(32));
  console.log(
    world.getArray().map((row) =>
      row.map((x) => x === 1 ? "O " : "  ").join("")
    )
      .join("\n"),
  );
  world.next();
}, 100);
```
