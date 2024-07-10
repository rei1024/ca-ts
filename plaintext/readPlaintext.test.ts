import { assertEquals } from "@std/assert";
import { readPlaintext } from "./readPlaintext.ts";

Deno.test("readPlaintext blinker", () => {
  assertEquals(
    readPlaintext(`!Name: Blinker
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

Deno.test("readPlaintext glider", () => {
  assertEquals(
    readPlaintext(`!Name: Glider
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
Deno.test("readPlaintext empty line", () => {
  assertEquals(
    readPlaintext(`!Name: Test
!
O

O`),
    {
      description: ["!Name: Test", "!"],
      pattern: [[1], [], [1]],
      size: {
        width: 1,
        height: 3,
      },
    },
  );
});
