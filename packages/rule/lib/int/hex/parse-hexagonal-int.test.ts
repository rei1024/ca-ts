import { assertEquals, assertThrows } from "@std/assert";
import { parseHexagonalIntRule } from "./parse-hexagonal-int.ts";

Deno.test("parseHexagonalIntRule B/SH", () => {
  assertEquals(parseHexagonalIntRule("B/SH"), {
    type: "hexagonal-int",
    transition: {
      birth: [],
      survive: [],
    },
  });
});

Deno.test("parseHexagonalIntRule b/sH", () => {
  assertEquals(parseHexagonalIntRule("b/sH"), {
    type: "hexagonal-int",
    transition: {
      birth: [],
      survive: [],
    },
  });
});

Deno.test("parseHexagonalIntRule 7", () => {
  assertThrows(() => {
    parseHexagonalIntRule("b7/sH");
  });
});

Deno.test("parseHexagonalIntRule B3/S23H", () => {
  assertEquals(parseHexagonalIntRule("B3/S23H"), {
    type: "hexagonal-int",
    transition: {
      birth: [
        "3m",
        "3o",
        "3p",
      ],
      survive: [
        "2m",
        "2o",
        "2p",
        "3m",
        "3o",
        "3p",
      ],
    },
  });
});

Deno.test("parseHexagonalIntRule B3mp/S2-m3H", () => {
  assertEquals(parseHexagonalIntRule("B3mp/S2-m3H"), {
    type: "hexagonal-int",
    transition: {
      birth: [
        "3m",
        "3p",
      ],
      survive: [
        "2o",
        "2p",
        "3m",
        "3o",
        "3p",
      ],
    },
  });
});

Deno.test("parseHexagonalIntRule B3m/S0H", () => {
  assertEquals(parseHexagonalIntRule("B3m/S0H"), {
    type: "hexagonal-int",
    transition: {
      birth: [
        "3m",
      ],
      survive: [
        "0",
      ],
    },
  });
});
