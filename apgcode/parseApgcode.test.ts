import { assertEquals, assertThrows } from "@std/assert";
import { cellsToArray } from "../rle/cellsToArray.ts";
import {
  ApgcodeParseError,
  parseApgcode,
  parseExtendedWechslerFormat,
} from "./parseApgcode.ts";

Deno.test("parseApgcode block", () => {
  const parsedCode = parseApgcode("xs4_33");
  assertEquals(parsedCode.type, "still-life");
  if (parsedCode.type === "still-life") {
    assertEquals(parsedCode.population, 4);
    assertEquals(parsedCode.cells.length, 4);
  }
  // convertible to JSON
  JSON.stringify(parseApgcode);
});

Deno.test("parseApgcode hwss", () => {
  const parsedCode = parseApgcode("xq4_27deee6");
  assertEquals(parsedCode.type, "spaceship");
  if (parsedCode.type === "spaceship") {
    assertEquals(parsedCode.period, 4);
    assertEquals(parsedCode.cells.length, 18);
  }
});

Deno.test("parseApgcode yl", () => {
  const parsedCode = parseApgcode(
    "yl144_1_16_afb5f3db909e60548f086e22ee3353ac",
  );
  assertEquals(parsedCode.type, "linear");
  if (parsedCode.type === "linear") {
    assertEquals(parsedCode.populationGrowthPeriod, 144);
    assertEquals(parsedCode.debrisPeriod, 1);
    assertEquals(parsedCode.populationGrowthAmount, 16);
    assertEquals(parsedCode.hash, "afb5f3db909e60548f086e22ee3353ac");
  }
});

Deno.test("parseExtendedWechslerFormat hwss", () => {
  const cells = parseExtendedWechslerFormat("27deee6");
  const array = cellsToArray(cells.map((p) => ({ position: p, state: 1 })));
  assertEquals(
    array.array.map((a) => a.map((a) => a === 1 ? "." : " ").join("")),
    [
      " ..    ",
      ".. ....",
      " ......",
      "  .... ",
    ],
  );
});

Deno.test("parseExtendedWechslerFormat 31 bit", () => {
  const cells = parseExtendedWechslerFormat("0ca178b96z69d1d96");
  const array = cellsToArray(cells.map((p) => ({ position: p, state: 1 })));
  assertEquals(
    array.array.map((a) => a.map((a) => a === 1 ? "." : " ").join("")),
    [
      "   .. .. ",
      "  . . . .",
      " .  .   .",
      " ..  ... ",
      "         ",
      " .....   ",
      ".     .  ",
      ". . . .  ",
      " .. ..   ",
    ],
  );
});

Deno.test("parseExtendedWechslerFormat Queen bee shuttle", () => {
  const _cells = parseExtendedWechslerFormat("w33z8kqrqk8zzzx33");
});

Deno.test("parseExtendedWechslerFormat y0 yz", () => {
  const cells = parseExtendedWechslerFormat("1y01yz1");
  assertEquals(cells, [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 45, y: 0 }]);
});

Deno.test("parseExtendedWechslerFormat yz twice", () => {
  const cells = parseExtendedWechslerFormat("1yzyz1");
  assertEquals(cells, [{ x: 0, y: 0 }, { x: 79, y: 0 }]);
});

Deno.test("parseApgcode Error", () => {
  assertThrows(() => {
    parseApgcode("!");
  }, ApgcodeParseError);
});

Deno.test("parseApgcode population error", () => {
  assertThrows(() => {
    parseApgcode("xsa_33");
  }, ApgcodeParseError);
});

Deno.test("parseApgcode period error", () => {
  assertThrows(() => {
    parseApgcode("xpa_33");
  }, ApgcodeParseError);

  assertThrows(() => {
    parseApgcode("xqa_33");
  }, ApgcodeParseError);
});

Deno.test("parseExtendedWechslerFormat Error", () => {
  assertThrows(() => {
    parseExtendedWechslerFormat("!");
  }, ApgcodeParseError);
});
