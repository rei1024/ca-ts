import { assertEquals, assertThrows } from "@std/assert";
import { RLE_TEST_DATA } from "./test-data/mod.ts";
import { parseRLE } from "./parseRLE.ts";
import { stringifyRLE } from "./stringifyRLE.ts";
import type { CACell } from "./mod.ts";

function makeCells(list: { x: number; y: number }[]): CACell[] {
  return list.map((p) => ({ position: p, state: 1 }));
}

const blinkerCells = makeCells([
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
]);

Deno.test("stringifyRLE", () => {
  assertEquals(
    stringifyRLE({}),
    "x = 0, y = 0, rule = B3/S23\n!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: [],
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: {
        width: 0,
        height: 0,
      },
      XRLE: null,
    }),
    "x = 0, y = 0, rule = B3/S23\n!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: [],
      comments: [],
      ruleString: "B3/S23",
      size: {
        width: 0,
        height: 0,
      },
      XRLE: null,
    }),
    "x = 0, y = 0, rule = B3/S23\n!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: [],
      comments: ["#Comment"],
      trailingComment: "",
      ruleString: "B3/S23",
      size: {
        width: 0,
        height: 0,
      },
      XRLE: null,
    }),
    "#Comment\nx = 0, y = 0, rule = B3/S23\n!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: [],
      trailingComment: "abc\ndef",
      ruleString: "B3/S23",
      size: {
        width: 0,
        height: 0,
      },
    }),
    "x = 0, y = 0, rule = B3/S23\n!abc\ndef",
  );

  assertEquals(
    stringifyRLE({
      cells: [],
      trailingComment: "\nabc\ndef",
      ruleString: "B3/S23",
      size: {
        width: 0,
        height: 0,
      },
    }),
    "x = 0, y = 0, rule = B3/S23\n!\nabc\ndef",
  );

  // empty size
  assertEquals(
    stringifyRLE({
      cells: [],
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: null,
      XRLE: null,
    }),
    "x = 0, y = 0, rule = B3/S23\n!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: blinkerCells,
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: null,
      XRLE: null,
    }),
    "x = 3, y = 1, rule = B3/S23\n3o!\n",
  );

  // partial
  assertEquals(
    stringifyRLE({
      cells: blinkerCells,
    }),
    "x = 3, y = 1, rule = B3/S23\n3o!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: makeCells([
        { x: 1, y: 3 },
        { x: 1, y: 10 },
      ]),
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: null,
      XRLE: null,
    }),
    "#CXRLE Pos=1,3\nx = 1, y = 8, rule = B3/S23\no7$o!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: blinkerCells,
      comments: ["#N Blinker"],
      trailingComment: "",
      ruleString: "B3/S23",
      size: {
        width: 3,
        height: 1,
      },
      XRLE: null,
    }),
    `#N Blinker
x = 3, y = 1, rule = B3/S23
3o!
`,
  );
});

Deno.test("stringifyRLE not sorted", () => {
  assertThrows(
    () => {
      stringifyRLE({
        cells: makeCells([{ x: 1, y: 0 }, { x: 0, y: 0 }]),
        ruleString: "B3/S23",
      });
    },
    Error,
    "cells must be sorted",
  );

  assertThrows(
    () => {
      stringifyRLE({
        cells: makeCells([{ x: 0, y: 1 }, { x: 0, y: 0 }]),
        ruleString: "B3/S23",
      });
    },
    Error,
    "cells must be sorted",
  );
});

Deno.test("stringifyRLE XRLE", () => {
  const rle = {
    cells: makeCells([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
    trailingComment: "",
    ruleString: "B3/S23",
    XRLE: { position: { x: 4, y: 5 }, generation: "100" },
  };
  assertEquals(
    stringifyRLE(rle),
    "#CXRLE Pos=4,5 Gen=100\nx = 2, y = 2, rule = B3/S23\no$bo!\n",
  );

  assertEquals(
    stringifyRLE({ ...rle, comments: [] }),
    "#CXRLE Pos=4,5 Gen=100\nx = 2, y = 2, rule = B3/S23\no$bo!\n",
  );

  assertEquals(
    stringifyRLE({ ...rle, comments: ["# Comment"] }),
    "#CXRLE Pos=4,5 Gen=100\n# Comment\nx = 2, y = 2, rule = B3/S23\no$bo!\n",
  );
});

Deno.test("stringifyRLE acceptUnorderedCells", () => {
  stringifyRLE({
    cells: makeCells([{ x: 1, y: 0 }, { x: 0, y: 0 }]),
    ruleString: "B3/S23",
  }, { acceptUnorderedCells: true });

  {
    const input = makeCells([{ x: 0, y: 1 }, { x: 0, y: 0 }]);
    const clone = structuredClone(input);
    stringifyRLE({
      cells: input,
      ruleString: "B3/S23",
    }, { acceptUnorderedCells: true });
    assertEquals(input, clone, "no mutation");
  }

  stringifyRLE({
    cells: makeCells([
      { x: 1, y: 2 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ]),
    ruleString: "B3/S23",
  }, { acceptUnorderedCells: true });
});

Deno.test("stringifyRLE invalid state", () => {
  const errorStates = [
    -2,
    -1,
    256,
    0.5,
    1.5,
    NaN,
    Infinity,
    -Infinity,
  ];

  for (const state of errorStates) {
    assertThrows(
      () => {
        stringifyRLE({
          cells: [{ position: { x: 1, y: 0 }, state }],
          comments: [],
          trailingComment: "",
          ruleString: "B3/S23",
          size: {
            width: 0,
            height: 0,
          },
          XRLE: null,
        });
      },
      Error,
      `invalid state ${state}`,
    );
  }
});

Deno.test("stringifyRLE negative position", () => {
  assertEquals(
    stringifyRLE({
      cells: [{ position: { x: -1, y: 0 }, state: 1 }],
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: null, // calculated
      XRLE: null,
    }),
    "#CXRLE Pos=-1,0\nx = 1, y = 1, rule = B3/S23\no!\n",
  );

  assertEquals(
    stringifyRLE({
      cells: [{ position: { x: 1, y: -1 }, state: 1 }],
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: null, // calculated
      XRLE: null,
    }),
    "#CXRLE Pos=1,-1\nx = 1, y = 1, rule = B3/S23\no!\n",
  );
});

Deno.test("stringifyRLE chacha", () => {
  const parsedRLE = parseRLE(RLE_TEST_DATA.chacha);
  const str = stringifyRLE(parsedRLE);
  const parseRLETwice = parseRLE(str);
  assertEquals(parsedRLE, { ...parseRLETwice, trailingComment: "" });
});

Deno.test("stringifyRLE parseRLE", () => {
  function assertBack(
    str: string,
    { checkMetaRecovery = true, withTrim = false } = {},
  ) {
    const parsed = parseRLE(str);

    function maybeTrim(v: string) {
      return withTrim ? v.trim() : v;
    }

    assertEquals(maybeTrim(stringifyRLE(parsed)), maybeTrim(str));

    if (checkMetaRecovery) {
      assertEquals(
        maybeTrim(stringifyRLE({ ...parsed, size: null, XRLE: null })),
        maybeTrim(str),
      );
    }
  }

  assertBack(`x = 0, y = 0, rule = B3/S23\n!\n`);

  assertBack(`x = 3, y = 3, rule = B3/S23\no!\n`, {
    checkMetaRecovery: false,
  });

  assertBack(`x = 3, y = 3, rule = B3/S23\nbo$2bo$3o!\n`);

  assertBack(`x = 36, y = 9, rule = B3/S23
24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b
obo$10bo5bo7bo$11bo3bo$12b2o!\n`);

  assertBack(`x = 2, y = 2, rule = B3/S23
2o$2o!\n`);

  assertBack(`x = 75, y = 64, rule = B3/S23
42bo$41b2o$40b3obo9b2o$13bo25b2o13b2o$13b2o25b2o$2o9bob3o25bo$2o13b2o$
14b2o25bo$14bo25b2o$39b2o13b2o$14bo25b3obo9b2o$14b2o25b2o$2o13b2o25bo$
2o9bob3o$13b2o$13bo51bo5b2o$64b3o4b2o$63b2ob2o2$62bobobobo2$63b2ob2o$
15b2o40b2o4b2ob2o$15b2o39bobo6bo$58bo6$15b3o3b3o$15bo2bobo2bo$14bo3bob
o3bo38b2obo3bob2o$14b4o3b4o38bo2bo3bo2bo$15bo7bo40b3o3b3o$35b2o$35b2o
6$64b2o5b2o$64b2o5b2o5$63bo$15b2o5b2o11b2o5b2o17bobo$15b2o5b2o11bob2ob
2obo18b2o$36bobobobo$36bobobobo$35bo7bo4$37b2ob2o29b2o$35bo2bobo2bo27b
obo$35b3o3b3o29bo$36bo5bo30b2o2$35b2o5b2o$35b2o5b2o!\n`);

  assertBack(`x = 9, y = 7, rule = Symbiosis
.A.A.A.A$A7.A2$2.A3.A$.B.A.A.B$2.B.A.B$3.B.B!\n`);

  assertBack(`x = 9, y = 3, rule = JvN29
5.pA3I$M3IpAJR$4.2QR!\n`);

  assertBack(RLE_TEST_DATA.cloverleaf, { withTrim: true });

  assertBack(`x = 0, y = 0, rule = B3/S23\n!abc\ndef`);
  assertBack("x = 1, y = 8, rule = B3/S23\no7$o!\n");
  assertBack("x = 1, y = 8, rule = B3/S23\no7$o!\nabc\ndef\nabc");

  assertBack(`#CXRLE Gen=0 Pos=0,0\nx = 2, y = 3, rule = B3/S23\no!\n`, {
    checkMetaRecovery: false,
  });

  // with offset
  assertBack(`#CXRLE Gen=0 Pos=1,2\nx = 2, y = 3, rule = B3/S23\no!\n`, {
    checkMetaRecovery: false,
  });
  assertBack(`#CXRLE Gen=0 Pos=-1,-2\nx = 2, y = 3, rule = B3/S23\no!`, {
    checkMetaRecovery: false,
    withTrim: true,
  });

  assertBack("#CXRLE Pos=-1,-2\nx = 1, y = 8, rule = B3/S23\no7$o!\n");

  assertBack(
    [
      `#CXRLE Pos=-11,-9`,
      `x = 10, y = 7, rule = B3/S23`,
      `4b6o$3bo5bo$b2o5b2o$2o2bo3b2o$o3bo$ob2o$3o!`,
    ].join("\n"),
    { withTrim: true },
  );
});

// Generate random cells for testing
function generateRandomCells(
  {
    count,
    width,
    height,
    maxState = 1,
  }: {
    count: number;
    width: number;
    height: number;
    maxState?: number;
  },
): CACell[] {
  if (maxState < 2) {
    throw new Error("maxState must be at least 2");
  }

  const cellMap = new Map<string, CACell>();
  const maxCells = width * height;

  if (count > maxCells) {
    count = maxCells;
  }

  while (cellMap.size < count) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    /**
     * 1 to maxState - 1
     */
    const state = Math.floor(Math.random() * (maxState - 1)) + 1;
    cellMap.set(`${x},${y}`, { position: { x, y }, state: state });
  }

  return Array.from(cellMap)
    .map((s) => {
      return s[1];
    })
    .sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });
}

Deno.test("stringifyRLE parseRLE roundtrip tests by randomized", () => {
  for (let i = 0; i < 50; i++) {
    const randomCells = generateRandomCells({
      count: 100,
      width: 50,
      height: 50,
      maxState: 255,
    });

    if (randomCells.length === 0) {
      continue;
    }

    const rleObj = {
      cells: randomCells,
      comments: [],
      trailingComment: "",
      ruleString: "B3/S23",
      size: null,
      XRLE: null,
    };

    const rleString = stringifyRLE(rleObj);
    const parsedRLE = parseRLE(rleString);
    assertEquals(parsedRLE.cells, rleObj.cells);
  }
});

Deno.test("stringifyRLE 1..255", () => {
  const cells = Array(255).fill(null).map((_, i) => {
    return { position: { x: i, y: 0 }, state: i + 1 };
  });

  const str = stringifyRLE({
    cells: cells,
    ruleString: "255",
    size: {
      width: 0,
      height: 0,
    },
  });
  const rle = parseRLE(str);
  assertEquals(rle.cells, cells);
});

Deno.test("stringifyRLE maxLineChars", () => {
  const rle = parseRLE(`x = 1, y = 1, rule = B3/S23\nobobo!`);

  assertEquals(
    stringifyRLE(rle, { maxLineChars: 3 }),
    `x = 1, y = 1, rule = B3/S23\nobo\nbo!\n`,
  );

  assertEquals(
    stringifyRLE(rle, { maxLineChars: 1 }),
    `x = 1, y = 1, rule = B3/S23\no\nb\no\nb\no\n!\n`,
  );

  assertThrows(() => {
    stringifyRLE(rle, { maxLineChars: 0 });
  });
});
