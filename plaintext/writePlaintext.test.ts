import { assertEquals, assertThrows } from "@std/assert";
import { writePlaintext } from "./writePlaintext.ts";

const blinker = `!Name: Blinker
!
OOO`;

const glider = `!Name: Glider
!
.O.
..O
OOO`;

Deno.test("writePlaintext blinker", () => {
  assertEquals(
    writePlaintext({
      description: ["!Name: Blinker", "!"],
      pattern: [[1, 1, 1]],
    }),
    blinker,
  );

  assertEquals(
    writePlaintext({
      description: ["!Name: Blinker", "!"],
      pattern: [[1, 1, 1]],
      size: { width: 0, height: 0 }, // type check
    }),
    blinker,
  );
});

Deno.test("writePlaintext empty description", () => {
  assertEquals(
    writePlaintext({
      description: [],
      pattern: [[1, 1, 1]],
    }),
    "OOO",
  );
});

Deno.test("writePlaintext glider", () => {
  assertEquals(
    writePlaintext({
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

Deno.test("writePlaintext description no exclamation mark error", () => {
  assertThrows(() => {
    writePlaintext({
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
