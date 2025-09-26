import { assertEquals, assertThrows } from "@std/assert";
import {
  parseOuterTotalistic,
  stringifyOuterTotalistic,
} from "./outer-totalistic.ts";

Deno.test("parseOuterTotalistic B3/S23", () => {
  const items = [
    "B3/S23",
    "B3/S32",
    "b3/s23",
    "B3/s23",
    "23/3",
    "32/3",
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

Deno.test("parseOuterTotalistic B3/S23V", () => {
  assertEquals(parseOuterTotalistic("B3/S23V"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
    neighborhood: "von-neumann",
  });
});

Deno.test("parseOuterTotalistic B3/S23H", () => {
  assertEquals(parseOuterTotalistic("B3/S23H"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
    neighborhood: "hexagonal",
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

Deno.test("parseOuterTotalistic XYZ", () => {
  const items = [
    "B3/S23X",
    "B3/S23Y",
    "B3/S23Z",
    "B3/S23x",
    "B3/S23y",
    "B3/S23z",
  ];

  for (const item of items) {
    assertThrows(() => {
      parseOuterTotalistic(item);
    });

    assertThrows(() => {
      parseOuterTotalistic(item + "H");
    });

    assertThrows(() => {
      parseOuterTotalistic(item + "V");
    });
  }
});

Deno.test("parseOuterTotalistic B/S9", () => {
  assertThrows(() => {
    parseOuterTotalistic("B/S9");
  });
});

Deno.test("parseOuterTotalistic B3/S5V", () => {
  assertThrows(() => {
    parseOuterTotalistic("B3/S5V");
  });
});

Deno.test("parseOuterTotalistic B3/S7H", () => {
  assertThrows(() => {
    parseOuterTotalistic("B3/S5V");
  });
});

Deno.test("parseOuterTotalistic triangular B3/S23L", () => {
  assertEquals(parseOuterTotalistic("B3/S23L"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
    neighborhood: "triangular",
    triangularType: "moore",
  });
});

Deno.test("parseOuterTotalistic triangular B39Z/S23XYZL", () => {
  assertEquals(parseOuterTotalistic("B39Z/S23XYZL"), {
    type: "outer-totalistic",
    transition: {
      birth: [3, 9, 12],
      survive: [2, 3, 10, 11, 12],
    },
    neighborhood: "triangular",
    triangularType: "moore",
  });
});

Deno.test("parseOuterTotalistic triangular max", () => {
  const items = [
    "B/S4XLE",
    "B/S4XLR",
    "B/S7XLO",
    "B/S7XLI",
    "B/SXLB",
    "B/SXLV",
  ];

  for (const item of items) {
    assertThrows(() => {
      parseOuterTotalistic(item);
    });
  }
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

Deno.test("parseOuterTotalistic Generations error less than 2: 1", () => {
  assertThrows(
    () => {
      parseOuterTotalistic("B2/S23/1");
    },
    Error,
    "Generations should be greater than or equal to 2",
  );
});

Deno.test("parseOuterTotalistic Generations error less than 2: 0", () => {
  assertThrows(
    () => {
      parseOuterTotalistic("B2/S23/0");
    },
    Error,
    "Generations should be greater than or equal to 2",
  );
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

Deno.test("parseOuterTotalistic gridParameter", () => {
  assertEquals(parseOuterTotalistic("B3/S23:P30,20"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
    gridParameter: {
      size: {
        width: 30,
        height: 20,
      },
      topology: { type: "P" },
    },
  });
});

Deno.test("parseOuterTotalistic stringifyOuterTotalistic", () => {
  function assertBack(rule: string) {
    const parsedRule = parseOuterTotalistic(rule);
    assertEquals(stringifyOuterTotalistic(parsedRule), rule);
  }

  const items = [
    "B3/S23",
    "B3/S23/8",
    "B/S",
    "B012345678/S012345678",
    "B3/S23:T20,30",
    "B3/S23/3:T20,40",
    "B3/S23V",
    "B3/S23V:T30+1,20",
    "B3/S23H:K30,20*+1",
    "B3/S23L",
    "B3/S23XYZL",
    "B3XYZ/S23L",
    "B3/S23LI",
    "B3/S23LO",
    "B3/S23LB",
    "B3/S23LE",
    "B3/S23LR",
  ];

  for (const item of items) {
    assertBack(item);
  }
});

Deno.test("stringifyOuterTotalistic sort", () => {
  const rule = stringifyOuterTotalistic({
    type: "outer-totalistic",
    transition: {
      birth: [6, 2],
      survive: [4, 1],
    },
  });
  assertEquals(rule, "B26/S14");
});

Deno.test("stringifyOuterTotalistic error", () => {
  const items = [
    { birth: [9], survive: [] },
    { birth: [], survive: [9] },
    { birth: [9], survive: [9] },
    { birth: [-1], survive: [] },
    { birth: [], survive: [-1] },
    { birth: [-1], survive: [-1] },
    { birth: [1.5], survive: [] },
    { birth: [], survive: [1.5] },
  ];

  for (const item of items) {
    assertThrows(() => {
      stringifyOuterTotalistic({
        type: "outer-totalistic",
        transition: item,
      });
    });
  }
});
