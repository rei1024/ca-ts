import { assertEquals, assertThrows } from "@std/assert";
import { readRLE } from "./readRLE.ts";
import { RLE_TEST_DATA } from "./test-data/mod.ts";

Deno.test("readRLE cloverleaf", () => {
  const rle = readRLE(RLE_TEST_DATA.cloverleaf);
  assertEquals(rle.ruleString, "B3/S23");
  assertEquals(rle.cells.length, 56);
  assertEquals(rle.comments, [
    "#N Cloverleaf interchange",
    "#O Adam P. Goucher",
    "#C https://conwaylife.com/wiki/Cloverleaf_interchange",
    "#C https://conwaylife.com/patterns/cloverleafinterchange.rle",
  ]);
  assertEquals(rle.trailingComment, "");
  assertEquals(rle.size?.width, 13);
  assertEquals(rle.size?.height, 13);
  assertEquals(rle.XRLE, null);
});

Deno.test("readRLE glider", () => {
  const rle = readRLE(`#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`);

  assertEquals(
    rle,
    {
      cells: [
        { x: 1, y: 0, state: 1 },
        { x: 2, y: 1, state: 1 },
        { x: 0, y: 2, state: 1 },
        { x: 1, y: 2, state: 1 },
        { x: 2, y: 2, state: 1 },
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

Deno.test("readRLE header", () => {
  const output = readRLE(`x=3,y=2,rule=B23/S1`);
  assertEquals(output.size?.width, 3);
  assertEquals(output.size?.height, 2);
  assertEquals(output.ruleString, "B23/S1");
  assertEquals(output.cells, []);
});

Deno.test("readRLE header twice", () => {
  const output = readRLE(`x=3,y=2,rule=B23/S1`);
  assertEquals(output.size?.width, 3);
  assertEquals(output.size?.height, 2);
  assertEquals(output.ruleString, "B23/S1");
  assertEquals(output.cells, []);
});

Deno.test("readRLE header #r rule", () => {
  const output = readRLE(`#r 23/3\nx=3,y=2`);
  assertEquals(output.size?.width, 3);
  assertEquals(output.size?.height, 2);
  assertEquals(output.ruleString, "23/3");
  assertEquals(output.cells, []);
});

Deno.test("readRLE header #r is ignored if rule is present", () => {
  const output = readRLE(`#r 23/3\nx=3,y=2,rule=B23/S1`);
  assertEquals(output.size?.width, 3);
  assertEquals(output.size?.height, 2);
  assertEquals(output.ruleString, "B23/S1");
  assertEquals(output.cells, []);
});

Deno.test("readRLE comment space prefix", () => {
  const output = readRLE(`#C Comment 1\n  #C Comment 2\nx=3,y=2,rule=B23/S1`);
  assertEquals(output.comments, ["#C Comment 1", "  #C Comment 2"]);
});

Deno.test("readRLE header without rule", () => {
  const output = readRLE(`x=4,y=0`);
  assertEquals(output.size?.width, 4);
  assertEquals(output.size?.height, 0);
  assertEquals(output.ruleString, "B3/S23");
});

Deno.test("readRLE empty", () => {
  const output = readRLE(``);
  assertEquals(output.size, null);
  assertEquals(output.ruleString, ""); // FIXME: default rule
  assertEquals(output.cells, []);
});

Deno.test("readRLE b", () => {
  const output = readRLE(`b`);
  assertEquals(output.cells, []);
  assertEquals(output.comments, []);
  assertEquals(output.XRLE, null);
  assertEquals(output.size, null);
});

Deno.test("readRLE 3b", () => {
  const output = readRLE(`3b`);
  assertEquals(output.cells, []);
});

Deno.test("readRLE o", () => {
  const output = readRLE(`o`);
  assertEquals(output.cells, [{ x: 0, y: 0, state: 1 }]);
});

Deno.test("readRLE empty lines", () => {
  const output = readRLE(`x=3,y=2,rule=B23/S1
o
  
o

o

   o

`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
    { x: 1, y: 0, state: 1 },
    { x: 2, y: 0, state: 1 },
    { x: 3, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE 2o", () => {
  const output = readRLE(`2o`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
    { x: 1, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE 3b2o", () => {
  const output = readRLE(`3b2o`);
  assertEquals(output.cells, [
    { x: 3, y: 0, state: 1 },
    { x: 4, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE 10b1o", () => {
  const output = readRLE(`10b1o`);
  assertEquals(output.cells, [
    { x: 10, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE 123b1o", () => {
  const output = readRLE(`123b1o`);
  assertEquals(output.cells, [
    { x: 123, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE A~X", () => {
  const output = readRLE(`AX`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
    { x: 1, y: 0, state: 24 },
  ]);
});

Deno.test("readRLE multi state", () => {
  const output = readRLE(`pApXqAqXyAyO`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 25 },
    { x: 1, y: 0, state: 48 },
    { x: 2, y: 0, state: 49 },
    { x: 3, y: 0, state: 72 },
    { x: 4, y: 0, state: 241 },
    { x: 5, y: 0, state: 255 },
  ]);
});

Deno.test("readRLE multi stata error state become 1: 1", () => {
  const output = readRLE(`qZ`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE multi stata error state become 1: 2", () => {
  const output = readRLE(`BqZ`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 2 },
    { x: 1, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE multi stata error state become 1: 3", () => {
  const output = readRLE(`BqZC`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 2 },
    { x: 1, y: 0, state: 1 },
    { x: 2, y: 0, state: 3 },
  ]);
});

Deno.test("readRLE multi state x", () => {
  const output = readRLE(`xA`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 217 },
  ]);
});

Deno.test("readRLE !", () => {
  const output = readRLE(`o!o`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE ! with break", () => {
  const output = readRLE(`o!o\no`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
  ]);
});

Deno.test("readRLE $", () => {
  const output = readRLE(`o$o`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
    { x: 0, y: 1, state: 1 },
  ]);
});

Deno.test("readRLE 2$", () => {
  const output = readRLE(`o2$o`);
  assertEquals(output.cells, [
    { x: 0, y: 0, state: 1 },
    { x: 0, y: 2, state: 1 },
  ]);
});

Deno.test("readRLE CXRLE", () => {
  const output = readRLE(`#CXRLE Gen=0 Pos=1,2\no`);
  assertEquals(output.XRLE, { generation: "0", position: { x: 1, y: 2 } });
  assertEquals(output.cells, [
    { x: 1, y: 2, state: 1 },
  ]);

  // convertible to JSON
  JSON.stringify(output);
});

Deno.test("readRLE CXRLE with rule", () => {
  const output = readRLE(
    `#CXRLE Gen=0 Pos=1,2\nx = 2, y = 3, rule = B3/S23\no`,
  );
  assertEquals(output.cells, [
    { x: 1, y: 2, state: 1 },
  ]);
  assertEquals(output.XRLE, { generation: "0", position: { x: 1, y: 2 } });
  assertEquals(output.size?.width, 2);
  assertEquals(output.size?.height, 3);
});

Deno.test("readRLE trailingComment 1", () => {
  const output = readRLE(
    `#CXRLE Gen=0 Pos=1,2\nx = 2, y = 3, rule = B3/S23\no!`,
  );
  assertEquals(output.trailingComment, "");
});

Deno.test("readRLE trailingComment 2", () => {
  const output = readRLE(
    `#CXRLE Gen=0 Pos=1,2\nx = 2, y = 3, rule = B3/S23\no!abc`,
  );
  assertEquals(output.trailingComment, "abc");
});

Deno.test("readRLE trailingComment 3", () => {
  const output = readRLE(
    `#CXRLE Gen=0 Pos=1,2\nx = 2, y = 3, rule = B3/S23\no!abc\ndef\nghi`,
  );
  assertEquals(output.trailingComment, "abc\ndef\nghi");
});

Deno.test("readRLE error invalid state 256", () => {
  assertThrows(() => {
    const x = readRLE("yP");
  }, "invalid state");
});

Deno.test("readRLE 'Illegal multi-char state'", () => {
  const output = readRLE("pY");
  assertEquals(output.cells, [{ x: 0, y: 0, state: 1 }]);
});

Deno.test("readRLE forgiving niemiec cells", () => {
  const output = readRLE(`#N 16chacha.rle
#O Mark D. Niemiec's life synthesis database, Thu Feb 19 02:03:06 2015
x = 129, y = 46, rule = B3/S23
61bobo$61boo$62bo3$49bobo$50boo$50bo6$110bo$109bo$109b3o$114bo$64bobo
46bo$48b3o13boo31bo15b3o$50bo14bo19bx12bo6bo$obo3bo33bo8bo34bxbx9b3o5b
obo17bx$booboo19bx12bobo14bo8b3o17bxbx17bobo8bo6bxbxbx$bo3boo17bxbx12b
oo3bo9bobo7bo16bxxbxbxbx4b3o5boobobobo5bo7bxbxbxbx$23bxbx19bo7bobo9bo
3boo10bxbxbxbxx6bo5boboboboo5b3o4bxbxbxbx$bboo20bx18b3o8bo14bobo11bxbx
8bo8bobo17bxbxbx$boo57bo8bo13bxbx17bobo5b3o11bx$3bo40bo14bo24bx19bo6bo
$44boo13b3o32b3o15bo$43bobo50bo$95bo$98b3o$100bo$99bo6$59bo$58boo$58bo
bo3$47bo$47boo$46bobo!
  `);
  assertEquals(output.cells.length, 183);
});

Deno.test("readRLE forgiving niemiec cells 2", () => {
  const output = readRLE(`x = 0, y = 0, rule = B3/S23
61z!
  `);
  assertEquals(output.cells.length, 0);
});
