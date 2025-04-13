import { assertEquals, assertThrows } from "@std/assert";

import { stringifyINT } from "./stringify-int.ts";
import { parseIntRule } from "../int.ts";

Deno.test("stringifyINT", () => {
  assertEquals(
    stringifyINT({
      type: "int",
      transition: {
        birth: ["0"],
        survive: [],
      },
    }),
    "B0/S",
  );

  assertEquals(
    stringifyINT({
      type: "int",
      transition: {
        birth: ["8", "0"],
        survive: ["1c", "0", "3i", "3a"],
      },
    }),
    "B08/S01c3ai",
  );

  assertEquals(
    stringifyINT({
      type: "int",
      transition: {
        birth: ["1c", "1e"],
        survive: ["2a", "2c", "2i", "2k"],
      },
    }),
    "B1/S2-en",
  );
});

Deno.test("stringifyINT parseIntRule", () => {
  function assertBack(rule: string) {
    assertEquals(stringifyINT(parseIntRule(rule)), rule);
  }

  assertBack("B/S");
  assertBack("B012345678/S012345678");

  // Banks-I
  assertBack(
    `B3e4ejr5cinqy6-ei78/S012-e3-ajk4-akqw5-ajk6-e78`,
  );

  // LeapLife
  assertBack(`B2n3/S23-q`);

  // tlife
  assertBack(`B3/S2-i34q`);

  // Snowflakes
  assertBack(`B2ci3ai4c8/S02ae3eijkq4iz5ar6i7e`);

  // with generations
  assertBack(`B3/S23/7`);
});

Deno.test("stringifyINT condition error", () => {
  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        birth: ["3k"],
        // deno-lint-ignore no-explicit-any
        survive: ["1k" as any],
      },
    });
  });

  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        // deno-lint-ignore no-explicit-any
        birth: ["1k" as any],
        survive: ["3k"],
      },
    });
  });
});

Deno.test("stringifyINT condition duplicated error", () => {
  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        birth: ["3k", "3k"],
        survive: ["3k"],
      },
    });
  });

  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        birth: ["3k"],
        survive: ["3k", "3k"],
      },
    });
  });
});

Deno.test("stringifyINT generation error", () => {
  const items = [
    1,
    0,
    -1,
    Infinity,
    -Infinity,
    NaN,
  ];
  for (const item of items) {
    assertThrows(() => {
      stringifyINT({
        type: "int",
        transition: {
          birth: ["3k"],
          survive: ["3k"],
        },
        generations: item,
      });
    });
  }
});
