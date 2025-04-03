import { assertEquals, assertThrows } from "@std/assert";
import { parseOuterTotalistic } from "./outer-totalistic.ts";

Deno.test("parseOuterTotalistic B3/S23", () => {
  const items = [
    "B3/S23",
    "b3/s23",
    "B3/s23",
    "23/3",
  ];

  const expected = {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  };

  for (const item of items) {
    assertEquals({ item, rule: parseOuterTotalistic(item) }, {
      item,
      rule: expected,
    });
  }
});

Deno.test("parseOuterTotalistic B/S", () => {
  assertEquals(parseOuterTotalistic("B/S"), {
    type: "outer-totalistic",
    transition: {
      birth: [],
      survive: [],
    },
  });
});

Deno.test("parseOuterTotalistic B012345678/S012345678", () => {
  assertEquals(parseOuterTotalistic("B012345678/S012345678"), {
    type: "outer-totalistic",
    transition: {
      birth: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      survive: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    },
  });
});

Deno.test("parseOuterTotalistic sort B62/S41", () => {
  assertEquals(parseOuterTotalistic("B62/S41"), {
    type: "outer-totalistic",
    transition: {
      birth: [2, 6],
      survive: [1, 4],
    },
  });
});

Deno.test("parseOuterTotalistic B9/S", () => {
  assertThrows(() => {
    parseOuterTotalistic("B9/S");
  });
});

Deno.test("parseOuterTotalistic B/S9", () => {
  assertThrows(() => {
    parseOuterTotalistic("B/S9");
  });
});

Deno.test("parseOuterTotalistic Generations", () => {
  const items = [
    "B2/S23/8",
    "B2/S23/G8",
    "b2/s23/g8",
    "B2/S23/C8",
    "b2/s23/c8",
    "G8/B2/S23",
    "C8/B2/S23",
    "23/2/8",
  ];

  const expected = {
    type: "outer-totalistic",
    transition: {
      birth: [2],
      survive: [2, 3],
    },
    generations: 8,
  };

  for (const item of items) {
    assertEquals({ item, rule: parseOuterTotalistic(item) }, {
      item,
      rule: expected,
    });
  }
});

Deno.test("parseOuterTotalistic Generations error 8/B2/S23", () => {
  assertThrows(() => {
    parseOuterTotalistic("8/B2/S23");
  });
});

Deno.test("parseOuterTotalistic Generations /2/3", () => {
  assertEquals(parseOuterTotalistic("/2/3"), {
    type: "outer-totalistic",
    transition: {
      birth: [2],
      survive: [],
    },
    generations: 3,
  });
});

Deno.test("parseOuterTotalistic Generations error B2/S23/", () => {
  assertThrows(() => {
    parseOuterTotalistic("B2/S23/");
  });
});

Deno.test("parseOuterTotalistic Generations error 23/2/", () => {
  assertThrows(() => {
    parseOuterTotalistic("23/2/");
  });
});
