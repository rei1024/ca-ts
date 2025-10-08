import { assertEquals } from "@std/assert/equals";
import { intConditionList } from "./list.ts";
import { createConditionList } from "./generate-list.ts";

Deno.test("createConditionList", () => {
  assertEquals(createConditionList(), intConditionList);
});
