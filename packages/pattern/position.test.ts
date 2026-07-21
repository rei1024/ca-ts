import { assertEquals } from "@std/assert";
import { Pos } from "./position.ts";
import type { Position } from "./types.ts";

Deno.test("Pos.ZERO", () => {
  assertEquals(Pos.ZERO, { x: 0, y: 0 });
});

Deno.test("Pos.add", () => {
  const a: Position = { x: 2, y: 3 };
  const b: Position = { x: -1, y: 5 };
  assertEquals(Pos.add(a, b), { x: 1, y: 8 });
});

Deno.test("Pos.sub", () => {
  const a: Position = { x: 5, y: 10 };
  const b: Position = { x: 2, y: 3 };
  assertEquals(Pos.sub(a, b), { x: 3, y: 7 });
});

Deno.test("Pos.scale", () => {
  const p: Position = { x: 3, y: -4 };
  assertEquals(Pos.scale(p, 3), { x: 9, y: -12 });
});

Deno.test("Pos.scaleFrom", () => {
  const p: Position = { x: 4, y: 4 };
  const origin: Position = { x: 2, y: 2 };
  assertEquals(Pos.scaleFrom(p, origin, 2), { x: 6, y: 6 });
});

Deno.test("Pos.reflect", () => {
  const p: Position = { x: 3, y: 4 };

  // Default origin (0, 0)
  assertEquals(Pos.reflect(p), { x: -3, y: -4 });

  // Custom origin (1, 1)
  assertEquals(Pos.reflect(p, { x: 1, y: 1 }), { x: -1, y: -2 });
});

Deno.test("Pos.reflectHorizontal - numeric axis", () => {
  const p: Position = { x: 1, y: 3 };
  assertEquals(Pos.reflectHorizontal(p, 2), { x: 3, y: 3 });
});

Deno.test("Pos.reflectHorizontal - between x0 and x1", () => {
  const p: Position = { x: 1, y: 3 };
  // Between x = 0 and x = 1 (axis at x = 0.5)
  assertEquals(
    Pos.reflectHorizontal(p, { between: { x0: 0, x1: 1 } }),
    { x: 0, y: 3 },
  );
});

Deno.test("Pos.reflectVertical - numeric axis", () => {
  const p: Position = { x: 4, y: 1 };
  assertEquals(Pos.reflectVertical(p, 3), { x: 4, y: 5 });
});

Deno.test("Pos.reflectVertical - between y0 and y1", () => {
  const p: Position = { x: 4, y: 1 };
  // Between y = 2 and y = 3 (axis at y = 2.5)
  assertEquals(
    Pos.reflectVertical(p, { between: { y0: 2, y1: 3 } }),
    { x: 4, y: 4 },
  );
});

Deno.test("Pos.dotProd", () => {
  const a: Position = { x: 2, y: 3 };
  const b: Position = { x: 4, y: -1 };
  assertEquals(Pos.dotProd(a, b), 5); // 2*4 + 3*(-1) = 8 - 3 = 5
});
