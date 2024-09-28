/**
 * Conway's Game of Life simulation by bitwise operations.
 *
 * @example
 * ```ts
import { BitWorld } from "./BitWorld.ts";
const world = BitWorld.make({ width: 32, height: 32 });
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
 * ```
 *
 * @module
 */
export { BitGrid } from "./BitGrid.ts";
export { BitWorld } from "./BitWorld.ts";
