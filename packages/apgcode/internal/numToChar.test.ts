import { assertEquals } from "@std/assert/equals";
import { charToNum, charToNumForY } from "./charToNum.ts";
import { numToChar, numToCharForYSingleChar } from "./numToChar.ts";
import { assertThrows } from "@std/assert/throws";

Deno.test("numToChar", () => {
  function aseertBack(n: number) {
    assertEquals(charToNum(numToChar(n)), n);
  }

  for (let i = 0; i <= 31; i++) {
    aseertBack(i);
  }
});

Deno.test("numToCharForYSingleChar", () => {
  function aseertBack(n: number) {
    assertEquals(charToNumForY(numToCharForYSingleChar(n)), n);
  }

  for (let i = 4; i <= 39; i++) {
    aseertBack(i);
  }
});

Deno.test("numToCharForYSingleChar error", () => {
  assertThrows(() => {
    numToCharForYSingleChar(3);
  });
});
