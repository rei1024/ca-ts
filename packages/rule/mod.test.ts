import { assertEquals, assertThrows } from "@std/assert";
import { parseRule, stringifyRule } from "./mod.ts";
import { TEST_MAP_CGOL } from "./lib/map/parse-map.test.ts";

Deno.test("parseRule B3/S23", () => {
  assertEquals(parseRule("B3/S23"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
});

Deno.test("parseRule Life", () => {
  assertEquals(parseRule("Life"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });

  assertThrows(() => {
    parseRule("NoLife");
  });
});

Deno.test("parseRule B3k/S4i", () => {
  assertEquals(parseRule("B3k/S4i"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
  });
});

Deno.test("stringifyRule B3/S23", () => {
  assertEquals(
    stringifyRule({
      type: "outer-totalistic",
      transition: {
        birth: [3],
        survive: [2, 3],
      },
    }),
    "B3/S23",
  );
});

Deno.test("stringifyRule INT", () => {
  assertEquals(
    stringifyRule({
      type: "int",
      transition: {
        birth: ["2a", "4a"],
        survive: [],
      },
    }),
    "B2a4a/S",
  );
});

Deno.test("stringifyRule parseRule", () => {
  function assertBack(rule: string) {
    const parsedRule = parseRule(rule);
    assertEquals(stringifyRule(parsedRule), rule);
  }
  assertBack("B3/S23");
  assertBack(TEST_MAP_CGOL);
});

Deno.test("parseRule empty string", () => {
  assertThrows(() => {
    parseRule("");
  });

  assertThrows(() => {
    parseRule(" ");
  });
});
