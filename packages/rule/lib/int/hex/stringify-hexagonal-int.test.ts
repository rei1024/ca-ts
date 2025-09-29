import { assertEquals, assertThrows } from "@std/assert";

import { stringifyHexgonalINT } from "./stringify-hexagonal-int.ts";
import { parseHexagonalIntRule } from "./parse-hexagonal-int.ts";

Deno.test("stringifyHexgonalINT", () => {
  assertEquals(
    stringifyHexgonalINT({
      type: "hexagonal-int",
      transition: {
        birth: ["0"],
        survive: [],
      },
    }),
    "B0/SH",
  );

  assertEquals(
    stringifyHexgonalINT({
      type: "hexagonal-int",
      transition: {
        birth: ["6", "0"],
        survive: ["1", "0", "3m", "3o"],
      },
    }),
    "B06/S013moH",
  );

  assertEquals(
    stringifyHexgonalINT({
      type: "hexagonal-int",
      transition: {
        birth: [],
        survive: ["2m", "2o"],
      },
    }),
    "B/S2moH",
  );
});

Deno.test("parseHexagonalIntRule stringifyHexgonalINT", () => {
  function assertBack(rule: string) {
    assertEquals(stringifyHexgonalINT(parseHexagonalIntRule(rule)), rule);
  }

  assertBack("B/SH");
  assertBack("B0123456/S0123456H");

  assertBack(`B2o/S3mH`);

  // with generations
  assertBack(`B3/S23/7H`);

  // grid parameter
  assertBack(`B3/S23H:T20,40`);

  // generations and grid parameter
  assertBack(`B3/S23/3H:T20,40`);
});

Deno.test("stringifyHexgonalINT condition error", () => {
  assertThrows(() => {
    stringifyHexgonalINT({
      type: "hexagonal-int",
      transition: {
        birth: ["3o"],
        // deno-lint-ignore no-explicit-any
        survive: ["1o" as any],
      },
    });
  });

  assertThrows(() => {
    stringifyHexgonalINT({
      type: "hexagonal-int",
      transition: {
        // deno-lint-ignore no-explicit-any
        birth: ["1o" as any],
        survive: ["3o"],
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
      stringifyHexgonalINT({
        type: "hexagonal-int",
        transition: {
          birth: ["3o"],
          survive: ["3o"],
        },
        generations: item,
      });
    });
  }
});
