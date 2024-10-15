import { assertEquals, assertThrows } from "@std/assert";
import { parseRule } from "./mod.ts";

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
