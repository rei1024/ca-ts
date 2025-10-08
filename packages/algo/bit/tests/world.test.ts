import { assertThrows } from "@std/assert/throws";
import { World } from "./world.ts";

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
