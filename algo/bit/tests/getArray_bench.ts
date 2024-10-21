import { BitGrid } from "../mod.ts";

const N = 10;
const M = 500;

const width = 32 * 4;
const height = 32 * 4;

Deno.bench({ name: "BitGrid.getArray", group: "getArray" }, () => {
  for (let j = 0; j < N; j++) {
    const grid = BitGrid.make({ width, height });
    grid.random();

    for (let i = 0; i < M; i++) {
      grid.getArray();
    }
  }
});
