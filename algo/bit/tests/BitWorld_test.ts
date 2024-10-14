import { assertEquals } from "@std/assert";
import { BitWorld } from "../BitWorld.ts";
import { World } from "./world.ts";

function d(a: BitWorld) {
  return a.getArray().slice(0, 4).map((r) => r.slice(0, 4).join(""));
}

Deno.test("BitWorld is correct block", () => {
  const bitWorld = BitWorld.make({ width: 32, height: 32 });

  bitWorld.set(1, 1);
  bitWorld.set(1, 2);
  bitWorld.set(2, 1);
  bitWorld.set(2, 2);
  const before = d(bitWorld);

  bitWorld.next();

  assertEquals(
    d(bitWorld),
    before,
  );
});

Deno.test("BitWorld is correct", () => {
  const bitWorld = BitWorld.make({ width: 32 * 3, height: 32 });
  const world = new World(32 * 3, 32);

  randomCheck(bitWorld, world, 50);
});

Deno.test("BitWorld is correct 2", () => {
  const bitWorld = BitWorld.make({ width: 32 * 1, height: 32 });
  const world = new World(32 * 1, 32);
  randomCheck(bitWorld, world, 50);
});

Deno.test("BitWorld is correct transition", () => {
  const bitWorld = BitWorld.make({ width: 32 * 1, height: 32 }, {
    transition: { birth: [3], survive: [2, 3] },
  });
  const world = new World(32 * 1, 32);
  randomCheck(bitWorld, world, 50);
});

function randomCheck(bitWorld: BitWorld, world: World, n: number) {
  bitWorld.forEach((x, y) => {
    if (Math.random() > 0.5) {
      bitWorld.set(x, y);
      world.set(x, y);
    }
  });

  for (let i = 0; i < n; i++) {
    assertEquals(
      bitWorld.getArray(),
      world.getArray().map((x) => x.map((y) => Number(y))),
    );
    bitWorld.next();
    world.next();
  }
}
