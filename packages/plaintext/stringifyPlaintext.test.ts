import { assertEquals, assertThrows } from "@std/assert";
import { stringifyPlaintext } from "./stringifyPlaintext.ts";

const blinker = `!Name: Blinker
!
OOO`;

const glider = `!Name: Glider
!
.O.
..O
OOO`;

Deno.test("stringifyPlaintext blinker", () => {
  assertEquals(
    stringifyPlaintext({
      description: ["!Name: Blinker", "!"],
      pattern: [[1, 1, 1]],
    }),
    blinker,
  );

  assertEquals(
    stringifyPlaintext({
      description: ["!Name: Blinker", "!"],
      pattern: [[1, 1, 1]],
      size: { width: 0, height: 0 }, // type check
    }),
    blinker,
  );
});

Deno.test("stringifyPlaintext empty description", () => {
  assertEquals(
    stringifyPlaintext({
      description: [],
      pattern: [[1, 1, 1]],
    }),
    "OOO",
  );
});

Deno.test("stringifyPlaintext glider", () => {
  assertEquals(
    stringifyPlaintext({
      description: [
        "!Name: Glider",
        "!",
      ],
      pattern: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ],
    }),
    glider,
  );
});

Deno.test("stringifyPlaintext description no exclamation mark error", () => {
  assertThrows(() => {
    stringifyPlaintext({
      description: [
        "No exclamation mark",
      ],
      pattern: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ],
    });
  }, Error);
});
