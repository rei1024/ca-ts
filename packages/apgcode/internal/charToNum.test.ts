import { assertEquals } from "@std/assert/equals";
import { charToNum, charToNumForY } from "./charToNum.ts";

Deno.test("charToNum", () => {
  assertEquals(charToNum("0"), 0);
  assertEquals(charToNum("9"), 9);
  assertEquals(charToNum("a"), 10);
  assertEquals(charToNum("v"), 31);
  assertEquals(charToNum("w"), null);
  assertEquals(charToNum("A"), null);
});

Deno.test("charToNumForY", () => {
  assertEquals(charToNumForY("0"), 4);
  assertEquals(charToNumForY("9"), 13);
  assertEquals(charToNumForY("a"), 14);
  assertEquals(charToNumForY("v"), 35);
  assertEquals(charToNumForY("z"), 39);
  assertEquals(charToNumForY("A"), null);
});
