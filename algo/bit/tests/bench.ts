import { BitWorld } from "../mod.ts";
import { World } from "./world.ts";

const N = 10;
const M = 500;

const width = 32 * 1;
const height = 32 * 1;

Deno.bench({ name: "BitWorld", group: "algo" }, () => {
  for (let j = 0; j < N; j++) {
    const bitWorld = BitWorld.make({ width, height }, {
      transition: { birth: [3], survive: [2, 3] },
    });
    bitWorld.forEach((x, y) => {
      if (Math.random() > 0.5) {
        bitWorld.set(x, y);
      }
    });

    for (let i = 0; i < M; i++) {
      bitWorld.next();
    }
  }
});

Deno.bench({ name: "World", group: "algo" }, () => {
  for (let j = 0; j < N; j++) {
    const world = new World(width, height);
    world.forEach((x, y) => {
      if (Math.random() > 0.5) {
        world.set(x, y);
      }
    });

    for (let i = 0; i < M; i++) {
      world.next();
    }
  }
});
