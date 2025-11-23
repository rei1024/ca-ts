import { assertThrows } from "@std/assert/throws";
import { World } from "./world.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("World set", () => {
  const world = World.make({ width: 3, height: 4 });
  assertThrows(() => {
    world.set(0, 4);
  });

  assertThrows(() => {
    world.set(3, 0);
  });

  assertThrows(() => {
    world.set(-1, 0);
  });
});

Deno.test("World random", () => {
  const world = World.make({ width: 3, height: 4 });
  world.random({ liveRatio: 1 });
  assertEquals(
    world.getArray().every((row) => row.every((cell) => cell)),
    true,
  );
});
