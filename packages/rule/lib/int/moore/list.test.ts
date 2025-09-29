import { assertEquals } from "@std/assert/equals";
import { intConditionList } from "./list.ts";

Deno.test("intConditionArray.length", () => {
  assertEquals(intConditionList.length, 256);
});
