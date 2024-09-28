import { assertEquals } from "@std/assert";
import { BitWorld } from "../BitWorld.ts";
import { World } from "./world.ts";

Deno.test("BitWorld is correct", () => {
  const bitWorld = BitWorld.make({ width: 32 * 3, height: 32 });
  const world = new World(32 * 3, 32);

  bitWorld.forEach((x, y) => {
    if (Math.random() > 0.5) {
      bitWorld.set(x, y);
      world.set(x, y);
    }
  });

  for (let i = 0; i < 50; i++) {
    assertEquals(
      bitWorld.getArray(),
      world.getArray().map((x) => x.map((y) => Number(y))),
    );
    bitWorld.next();
    world.next();
  }
});

Deno.test("BitWorld is correct 2", () => {
  const bitWorld = BitWorld.make({ width: 32 * 1, height: 32 });
  const world = new World(32 * 1, 32);

  bitWorld.forEach((x, y) => {
    if (Math.random() > 0.5) {
      bitWorld.set(x, y);
      world.set(x, y);
    }
  });

  for (let i = 0; i < 50; i++) {
    assertEquals(
      bitWorld.getArray(),
      world.getArray().map((x) => x.map((y) => Number(y))),
    );
    bitWorld.next();
    world.next();
  }
});
