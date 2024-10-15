import { assertEquals, assertThrows } from "@std/assert";
import { intConditionArray, parseIntRule } from "./int.ts";

Deno.test("parseIntRule B3/S23", () => {
  assertEquals(parseIntRule("B3/S23"), {
    type: "int",
    transition: {
      birth: [
        "3c",
        "3e",
        "3k",
        "3a",
        "3i",
        "3n",
        "3y",
        "3q",
        "3j",
        "3r",
      ],
      survive: [
        "2c",
        "2e",
        "2k",
        "2a",
        "2i",
        "2n",
        "3c",
        "3e",
        "3k",
        "3a",
        "3i",
        "3n",
        "3y",
        "3q",
        "3j",
        "3r",
      ],
    },
  });
});

Deno.test("parseIntRule B3/S2-i34q", () => {
  assertEquals(parseIntRule("B3/S2-i34q"), {
    type: "int",
    transition: {
      birth: [
        "3c",
        "3e",
        "3k",
        "3a",
        "3i",
        "3n",
        "3y",
        "3q",
        "3j",
        "3r",
      ],
      survive: [
        "2c",
        "2e",
        "2k",
        "2a",
        "2n",
        "3c",
        "3e",
        "3k",
        "3a",
        "3i",
        "3n",
        "3y",
        "3q",
        "3j",
        "3r",
        "4q",
      ],
    },
  });
});

Deno.test("parseIntRule B3-nqr5ny678/S2-ik3-ry4ein5ky678", () => {
  assertEquals(parseIntRule("B3-nqr5ny678/S2-ik3-ry4ein5ky678"), {
    type: "int",
    transition: {
      birth: [
        "3c",
        "3e",
        "3k",
        "3a",
        "3i",
        "3y",
        "3j",
        "5n",
        "5y",
        "6c",
        "6e",
        "6k",
        "6a",
        "6i",
        "6n",
        "7c",
        "7e",
        "8",
      ],
      survive: [
        "2c",
        "2e",
        "2a",
        "2n",
        "3c",
        "3e",
        "3k",
        "3a",
        "3i",
        "3n",
        "3q",
        "3j",
        "4e",
        "4i",
        "4n",
        "5k",
        "5y",
        "6c",
        "6e",
        "6k",
        "6a",
        "6i",
        "6n",
        "7c",
        "7e",
        "8",
      ],
    },
  });
});

Deno.test("parseIntRule B3k/S4i", () => {
  assertEquals(parseIntRule("B3k/S4i"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
  });
});

Deno.test("parseIntRule B/S", () => {
  assertEquals(parseIntRule("B/S"), {
    type: "int",
    transition: {
      birth: [],
      survive: [],
    },
  });
});

Deno.test("parseIntRule error B-/S", () => {
  assertThrows(() => {
    parseIntRule("B-/S");
  });
});

Deno.test("parseIntRule error B9/S", () => {
  assertThrows(() => {
    parseIntRule("B9/S");
  });
});

Deno.test("intConditionArray.length", () => {
  assertEquals(intConditionArray.length, 256);
});
