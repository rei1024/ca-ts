import { assertEquals } from "@std/assert";
import { parsePlaintext } from "./parsePlaintext.ts";

Deno.test("parsePlaintext blinker", () => {
  assertEquals(
    parsePlaintext(`!Name: Blinker
!
OOO`),
    {
      description: ["!Name: Blinker", "!"],
      pattern: [[1, 1, 1]],
      size: {
        width: 3,
        height: 1,
      },
    },
  );
});

Deno.test("parsePlaintext glider", () => {
  assertEquals(
    parsePlaintext(`!Name: Glider
!
.O.
..O
OOO`),
    {
      description: [
        "!Name: Glider",
        "!",
      ],
      pattern: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ],
      size: {
        width: 3,
        height: 3,
      },
    },
  );
});

Deno.test("parsePlaintext empty line", () => {
  assertEquals(
    parsePlaintext(`!Name: Test
!
O

O`),
    {
      description: ["!Name: Test", "!"],
      pattern: [[1], [0], [1]],
      size: {
        width: 1,
        height: 3,
      },
    },
  );
});

Deno.test("parsePlaintext padding", () => {
  assertEquals(
    parsePlaintext(`!Name: Test
!
O.O
OO
O`),
    {
      description: ["!Name: Test", "!"],
      pattern: [[1, 0, 1], [1, 1, 0], [1, 0, 0]],
      size: {
        width: 3,
        height: 3,
      },
    },
  );
});
