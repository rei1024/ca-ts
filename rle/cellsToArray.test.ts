import { assertEquals } from "@std/assert";
import { cellsToArray } from "./cellsToArray.ts";

Deno.test("cellsToArray glider", () => {
  const glider = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 2, y: 1 }, state: 1 },
    { position: { x: 0, y: 2 }, state: 1 },
    { position: { x: 1, y: 2 }, state: 1 },
    { position: { x: 2, y: 2 }, state: 1 },
  ];

  assertEquals(cellsToArray(glider), {
    size: { width: 3, height: 3 },
    array: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  });

  assertEquals(
    cellsToArray(glider).array.map((row) =>
      row.map((c) => c === 1 ? "." : " ").join(" ")
    ),
    [
      "  .  ",
      "    .",
      ". . .",
    ],
  );
});
