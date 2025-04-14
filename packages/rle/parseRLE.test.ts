import { assertEquals, assertThrows } from "@std/assert";
import { parseRLE } from "./parseRLE.ts";
import { RLE_TEST_DATA } from "./test-data/mod.ts";
import { RLEParseError } from "./parseRLE/RLEParseError.ts";

Deno.test("parseRLE cloverleaf", () => {
  const rle = parseRLE(RLE_TEST_DATA.cloverleaf);
  assertEquals(rle.ruleString, "B3/S23");
  assertEquals(rle.cells.length, 56);
  assertEquals(rle.comments, [
    "#N Cloverleaf interchange",
    "#O Adam P. Goucher",
    "#C https://conwaylife.com/wiki/Cloverleaf_interchange",
    "#C https://conwaylife.com/patterns/cloverleafinterchange.rle",
  ]);
  assertEquals(rle.trailingComment, "");
  assertEquals(rle.size, { width: 13, height: 13 });
  assertEquals(rle.XRLE, null);
});

Deno.test("parseRLE glider", () => {
  const rle = parseRLE(RLE_TEST_DATA.glider);

  assertEquals(
    rle,
    {
      cells: [
        { position: { x: 1, y: 0 }, state: 1 },
        { position: { x: 2, y: 1 }, state: 1 },
        { position: { x: 0, y: 2 }, state: 1 },
        { position: { x: 1, y: 2 }, state: 1 },
        { position: { x: 2, y: 2 }, state: 1 },
      ],
      comments: [
        "#N Glider",
        "#O Richard K. Guy",
        "#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.",
        "#C www.conwaylife.com/wiki/index.php?title=Glider",
      ],
      trailingComment: "",
      ruleString: "B3/S23",
      size: {
        width: 3,
        height: 3,
      },
      XRLE: null,
    },
  );
});

Deno.test("parseRLE header", () => {
  const output = parseRLE(`x=3,y=2,rule=B23/S1`);
  assertEquals(output.size, { width: 3, height: 2 });
  assertEquals(output.ruleString, "B23/S1");
  assertEquals(output.cells, []);
});

Deno.test("parseRLE header without rule", () => {
  const output = parseRLE(`x=3,y=2`);
  assertEquals(output.size, { width: 3, height: 2 });
  assertEquals(output.ruleString, "B3/S23"); // TBD: null?
  assertEquals(output.cells, []);
});

Deno.test("parseRLE header #r rule", () => {
  const output = parseRLE(`#r 23/3\nx=3,y=2`);
  assertEquals(output.size, { width: 3, height: 2 });
  assertEquals(output.ruleString, "23/3");
  assertEquals(output.cells, []);
});

Deno.test("parseRLE header #r rule with whitespace", () => {
  const output = parseRLE(`   #r 23/3\nx=3,y=2`);
  assertEquals(output.size, { width: 3, height: 2 });
  assertEquals(output.ruleString, "23/3");
  assertEquals(output.cells, []);
});

Deno.test("parseRLE header #r is ignored if rule is present", () => {
  const output = parseRLE(`#r 23/3\nx=3,y=2,rule=B23/S1`);
  assertEquals(output.size, { width: 3, height: 2 });
  assertEquals(output.ruleString, "B23/S1");
  assertEquals(output.cells, []);
});

Deno.test("parseRLE header #r is ignored if rule is present after", () => {
  const output = parseRLE(`x=3,y=2,rule=B23/S1\n#r 23/3`);
  assertEquals(output.size, { width: 3, height: 2 });
  assertEquals(output.ruleString, "B23/S1");
  assertEquals(output.cells, []);
});

Deno.test("parseRLE comment space prefix", () => {
  const output = parseRLE(`#C Comment 1\n  #C Comment 2\nx=3,y=2,rule=B23/S1`);
  // leading space is deleted
  assertEquals(output.comments, ["#C Comment 1", "#C Comment 2"]);
});

Deno.test("parseRLE header without rule", () => {
  const output = parseRLE(`x=4,y=0`);
  assertEquals(output.size, { width: 4, height: 0 });
  assertEquals(output.ruleString, "B3/S23");
});

Deno.test("parseRLE empty", () => {
  const output = parseRLE(``);
  assertEquals(output.size, null);
  assertEquals(output.ruleString, ""); // FIXME: default rule
  assertEquals(output.cells, []);
});

Deno.test("parseRLE b", () => {
  const output = parseRLE(`b`);
  assertEquals(output.cells, []);
  assertEquals(output.comments, []);
  assertEquals(output.XRLE, null);
  assertEquals(output.size, null);
});

Deno.test("parseRLE 3b", () => {
  const output = parseRLE(`3b`);
  assertEquals(output.cells, []);
});

Deno.test("parseRLE o", () => {
  const output = parseRLE(`o`);
  assertEquals(output.cells, [{ position: { x: 0, y: 0 }, state: 1 }]);
});

Deno.test("parseRLE empty lines", () => {
  const output = parseRLE(`x=3,y=2,rule=B23/S1
o
  
o

o

   o

`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 2, y: 0 }, state: 1 },
    { position: { x: 3, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE DOS newline", () => {
  const output = parseRLE(`x=3,y=2,rule=B23/S1\r\no`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE old Mac newline", () => {
  const output = parseRLE(`x=3,y=2,rule=B23/S1\ro`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE error count end line", () => {
  assertThrows(() => {
    parseRLE(`2\no`);
  }, "Illegal whitespace after count");
});

Deno.test("parseRLE error whitespace between count and state", () => {
  assertThrows(() => {
    parseRLE(`2 o`);
  }, "Illegal whitespace after count");
});

Deno.test("parseRLE comment between", () => {
  const output = parseRLE(`# Comment 1
x=3,y=2,rule=B23/S1
o
# Comment 2
o
`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
  ]);
  assertEquals(output.comments, [
    "# Comment 1",
    "# Comment 2",
  ]);
});

Deno.test("parseRLE 2o", () => {
  const output = parseRLE(`2o`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE 3b2o", () => {
  const output = parseRLE(`3b2o`);
  assertEquals(output.cells, [
    { position: { x: 3, y: 0 }, state: 1 },
    { position: { x: 4, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE 10b1o", () => {
  const output = parseRLE(`10b1o`);
  assertEquals(output.cells, [
    { position: { x: 10, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE 123b1o", () => {
  const output = parseRLE(`123b1o`);
  assertEquals(output.cells, [
    { position: { x: 123, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE A~X", () => {
  const output = parseRLE(`AX`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 24 },
  ]);
});

Deno.test("parseRLE multi state", () => {
  const output = parseRLE(`pApXqAqXyAyO`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 25 },
    { position: { x: 1, y: 0 }, state: 48 },
    { position: { x: 2, y: 0 }, state: 49 },
    { position: { x: 3, y: 0 }, state: 72 },
    { position: { x: 4, y: 0 }, state: 241 },
    { position: { x: 5, y: 0 }, state: 255 },
  ]);
});

Deno.test("parseRLE multi state error state become 1: 1", () => {
  const output = parseRLE(`qZ`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE multi state error state become 1: 2", () => {
  const output = parseRLE(`BqZ`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 2 },
    { position: { x: 1, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE multi state error state become 1: 3", () => {
  const output = parseRLE(`BqZC`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 2 },
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 2, y: 0 }, state: 3 },
  ]);
});

Deno.test("parseRLE multi state x", () => {
  const output = parseRLE(`xA`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 217 },
  ]);
});

Deno.test("parseRLE !", () => {
  const output = parseRLE(`o!o`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
  ]);
  assertEquals(output.trailingComment, "o");
});

Deno.test("parseRLE ! with break", () => {
  const output = parseRLE(`o!o\no`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
  ]);
});

Deno.test("parseRLE $", () => {
  const output = parseRLE(`o$o`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 0, y: 1 }, state: 1 },
  ]);
});

Deno.test("parseRLE 2$", () => {
  const output = parseRLE(`o2$o`);
  assertEquals(output.cells, [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 0, y: 2 }, state: 1 },
  ]);
});

Deno.test("parseRLE CXRLE", () => {
  const output = parseRLE(`#CXRLE Gen=0 Pos=1,2\no`);
  assertEquals(output.XRLE, { generation: "0", position: { x: 1, y: 2 } });
  assertEquals(output.cells, [
    { position: { x: 1, y: 2 }, state: 1 },
  ]);

  // convertible to JSON
  JSON.stringify(output);
});

Deno.test("parseRLE size with leading whitespace", () => {
  const output = parseRLE(
    `   x = 2, y = 3, rule = B3/S23\no`,
  );
  assertEquals(output.size, { width: 2, height: 3 });
});

Deno.test("parseRLE size with leading whitespace with comment", () => {
  const output = parseRLE(
    `# Comment\n   x = 2, y = 3, rule = B3/S23\no`,
  );
  assertEquals(output.size, { width: 2, height: 3 });
});

Deno.test("parseRLE CXRLE with rule", () => {
  const output = parseRLE(
    `#CXRLE Gen=0 Pos=1,2\nx = 2, y = 3, rule = B3/S23\no`,
  );
  assertEquals(output.cells, [
    { position: { x: 1, y: 2 }, state: 1 },
  ]);
  assertEquals(output.XRLE, { generation: "0", position: { x: 1, y: 2 } });
  assertEquals(output.size?.width, 2);
  assertEquals(output.size?.height, 3);
});

Deno.test("parseRLE trailingComment 1", () => {
  const output = parseRLE(
    `x = 2, y = 3, rule = B3/S23\no!`,
  );
  assertEquals(output.trailingComment, "");
});

Deno.test("parseRLE trailingComment 2", () => {
  const output = parseRLE(
    `x = 2, y = 3, rule = B3/S23\no!abc`,
  );
  assertEquals(output.trailingComment, "abc");
});

Deno.test("parseRLE trailingComment 3", () => {
  const output = parseRLE(
    `x = 2, y = 3, rule = B3/S23\no!abc\ndef\n xyz`,
  );
  assertEquals(output.trailingComment, "abc\ndef\n xyz");
});

Deno.test("parseRLE trailingComment new line", () => {
  const output = parseRLE(
    `x = 2, y = 3, rule = B3/S23\no!\nabc`,
  );
  assertEquals(output.trailingComment, "\nabc");
});

Deno.test("parseRLE error invalid state 256", () => {
  assertThrows(
    () => {
      parseRLE("yP");
    },
    RLEParseError,
    "invalid state",
  );
});

Deno.test("parseRLE 'Illegal multi-char state'", () => {
  const output = parseRLE("pY");
  assertEquals(output.cells, [{ position: { x: 0, y: 0 }, state: 1 }]);
});

Deno.test("parseRLE forgiving niemiec cells", () => {
  const output = parseRLE(RLE_TEST_DATA.chacha);
  assertEquals(output.cells.length, 183);
});

Deno.test("parseRLE forgiving niemiec cells 2", () => {
  const output = parseRLE(`x = 0, y = 0, rule = B3/S23
61z!
  `);
  assertEquals(output.cells.length, 0);
});
