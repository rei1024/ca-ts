import { assertEquals } from "@std/assert/equals";
import { parseMapRule } from "./parse-map.ts";
import { stringifyMap } from "./stringify-map.ts";
import { TEST_MAP_CGOL } from "./parse-map.test.ts";

Deno.test("stringifyMap parseMapRule", () => {
  function assertBack(rule: string) {
    assertEquals(stringifyMap(parseMapRule(rule)), rule);
  }
  assertBack(TEST_MAP_CGOL + "==");
});
