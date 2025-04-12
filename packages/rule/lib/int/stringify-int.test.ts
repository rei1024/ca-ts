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
});

Deno.test("stringifyINT parseIntRule", () => {
  function assertBack(rule: string) {
    assertEquals(stringifyINT(parseIntRule(rule)), rule);
  }

  // Banks-I
  assertBack(
    `B3e4ejr5cinqy6-ei78/S012-e3-ajk4-akqw5-ajk6-e78`,
  );
  // LeapLife
  assertBack(`B2n3/S23-q`);

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
        survive: ["unknown" as any],
      },
    });
  });

  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        // deno-lint-ignore no-explicit-any
        birth: ["unknown" as any],
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
  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        birth: ["3k"],
        survive: ["3k"],
      },
      generations: 1,
    });
  });

  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        birth: ["3k"],
        survive: ["3k"],
      },
      generations: Infinity,
    });
  });

  assertThrows(() => {
    stringifyINT({
      type: "int",
      transition: {
        birth: ["3k"],
        survive: ["3k"],
      },
      generations: -1,
    });
  });
});
