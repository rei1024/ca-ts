import { assertEquals } from "@std/assert/equals";
import { intConditionList } from "./list.ts";

Deno.test("intConditionList.length", () => {
  assertEquals(intConditionList.length, 256);
});
