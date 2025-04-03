import { assertEquals } from "@std/assert";
import { stateToString } from "./stateToString.ts";

Deno.test("stateToString binary", () => {
  assertEquals(stateToString(0, false), "b");
  assertEquals(stateToString(1, false), "o");
});

Deno.test("stateToString multi state", () => {
  assertEquals(stateToString(0, true), ".");
  assertEquals(stateToString(1, true), "A");
  assertEquals(stateToString(24, true), "X");
  assertEquals(stateToString(25, true), "pA");
  assertEquals(stateToString(48, true), "pX");
  assertEquals(stateToString(241, true), "yA");
  assertEquals(stateToString(255, true), "yO");
});
