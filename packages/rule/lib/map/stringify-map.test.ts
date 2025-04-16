import { assertEquals } from "@std/assert/equals";
import { parseMapRule } from "./parse-map.ts";
import { stringifyMap } from "./stringify-map.ts";
import { TEST_MAP_CGOL } from "./parse-map.test.ts";
import { assertThrows } from "@std/assert/throws";

function assertBack(rule: string) {
  assertEquals(stringifyMap(parseMapRule(rule)), rule);
}

Deno.test("stringifyMap parseMapRule", () => {
  assertBack(TEST_MAP_CGOL);
});

Deno.test("stringifyMap gridParameter", () => {
  assertBack(TEST_MAP_CGOL + ":T30,20");
});

Deno.test("stringifyMap parseMapRule von", () => {
  // cspell:disable-next-line
  assertBack("MAPAAD//w");
});

Deno.test("stringifyMap error", () => {
  assertThrows(() => {
    stringifyMap({
      type: "map",
      data: [],
      neighbors: "moore",
    });
  });
});
