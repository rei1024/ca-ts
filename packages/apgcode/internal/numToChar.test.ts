import { assertEquals } from "@std/assert/equals";
import { charToNum, charToNumForY } from "./charToNum.ts";
import {
  numToChar,
  numToCharForY,
  numToCharForYSingleChar,
} from "./numToChar.ts";
import { assertThrows } from "@std/assert/throws";

Deno.test("numToChar", () => {
  function assertBack(n: number) {
    assertEquals(charToNum(numToChar(n)), n);
  }

  for (let i = 0; i <= 31; i++) {
    assertBack(i);
  }
});

Deno.test("numToCharForY 0", () => {
  assertEquals(numToCharForY(0), "");
});

Deno.test("numToCharForY 39", () => {
  assertEquals(numToCharForY(39), "yz");
});

Deno.test("numToCharForY 40", () => {
  assertEquals(numToCharForY(40), "yz0");
});

Deno.test("numToCharForY 80", () => {
  assertEquals(numToCharForY(80), "yzyzw");
});

Deno.test("numToCharForYSingleChar", () => {
  function assertBack(n: number) {
    assertEquals(charToNumForY(numToCharForYSingleChar(n)), n);
  }

  for (let i = 4; i <= 39; i++) {
    assertBack(i);
  }
});

Deno.test("numToCharForYSingleChar error", () => {
  assertThrows(() => {
    numToCharForYSingleChar(3);
  });
});
