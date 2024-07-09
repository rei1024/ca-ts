import { assertEquals } from "@std/assert";
import { writeState } from "./writeState.ts";

Deno.test("writeState binary", () => {
  assertEquals(writeState(0, false), "b");
  assertEquals(writeState(1, false), "o");
});

Deno.test("writeState multi state", () => {
  assertEquals(writeState(0, true), ".");
  assertEquals(writeState(1, true), "A");
  assertEquals(writeState(24, true), "X");
  assertEquals(writeState(25, true), "pA");
  assertEquals(writeState(48, true), "pX");
  assertEquals(writeState(241, true), "yA");
  assertEquals(writeState(255, true), "yO");
});
