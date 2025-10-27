import { assertEquals, assertThrows } from "@std/assert";
import {
  ApgcodeParseError,
  parseApgcode,
  parseExtendedWechslerFormat,
} from "./parseApgcode.ts";
import { type CACell, CACellList } from "../pattern/mod.ts";
import { stringifyApgcode } from "./stringifyApgcode.ts";

function cellsToArray(cells: CACell[]) {
  return CACellList.fromCells(cells).to2dArray();
}

function assertBack(apgcode: string) {
  const parsed = parseApgcode(apgcode);
  const stringified = stringifyApgcode(parsed);
  assertEquals(stringified, apgcode);
}

Deno.test("stringifyApgcode", () => {
  const testCases = [
    "xs4_33",
    "xp15_3a5",
    "xq4_27deee6",
  ];
  for (const testCase of testCases) {
    assertBack(testCase);
  }
});
