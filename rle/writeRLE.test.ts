import { assertEquals } from "@std/assert";
import { RLE_TEST_DATA } from "./test-data/mod.ts";
import { readRLE } from "./readRLE.ts";
import { writeRLE } from "./writeRLE.ts";

Deno.test("writeRLE", () => {
  assertEquals(
    writeRLE({
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
    writeRLE({
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
    writeRLE({
      cells: [],
      comments: [],
      trailingComment: "abc\ndef",
      ruleString: "B3/S23",
      size: {
        width: 0,
        height: 0,
      },
      XRLE: null,
    }),
    "x = 0, y = 0, rule = B3/S23\n!abc\ndef\n",
  );

  assertEquals(
    writeRLE({
      cells: [
        { x: 0, y: 0, state: 1 },
        { x: 1, y: 0, state: 1 },
        { x: 2, y: 0, state: 1 },
      ],
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

Deno.test("writeRLE readRLE", () => {
  function assertBack(str: string) {
    assertEquals(writeRLE(readRLE(str)).trim(), str.trim());
  }

  assertBack(`x = 0, y = 0, rule = B3/S23\n!\n`);

  assertBack(`x = 3, y = 3, rule = B3/S23\no!\n`);

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

  assertBack(RLE_TEST_DATA.cloverleaf);

  assertBack(`x = 0, y = 0, rule = B3/S23\n!abc\ndef`);
});