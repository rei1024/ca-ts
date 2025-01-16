import { assertEquals, assertThrows } from "@std/assert";
import { parseOuterTotalistic } from "./outer-totalistic.ts";

Deno.test("parseOuterTotalistic B3/S23", () => {
  assertEquals(parseOuterTotalistic("B3/S23"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
});

Deno.test("parseOuterTotalistic b3/s23 lower case", () => {
  assertEquals(parseOuterTotalistic("b3/s23"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
});

Deno.test("parseOuterTotalistic 23/3", () => {
  assertEquals(parseOuterTotalistic("23/3"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
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

Deno.test("parseOuterTotalistic Generations B2/S23/8", () => {
  assertEquals(parseOuterTotalistic("B2/S23/8"), {
    type: "outer-totalistic",
    transition: {
      birth: [2],
      survive: [2, 3],
    },
    generations: 8,
  });
});

Deno.test("parseOuterTotalistic Generations 23/2/8", () => {
  assertEquals(parseOuterTotalistic("23/2/8"), {
    type: "outer-totalistic",
    transition: {
      birth: [2],
      survive: [2, 3],
    },
    generations: 8,
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
