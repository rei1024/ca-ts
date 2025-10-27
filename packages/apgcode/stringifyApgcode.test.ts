import { assertEquals } from "@std/assert";
import { parseApgcode, parseExtendedWechslerFormat } from "./parseApgcode.ts";
import { type CACell, CACellList } from "../pattern/mod.ts";
import {
  cellsOffsetZero,
  stringifyApgcode,
  stringifyExtendedWechslerFormat,
} from "./stringifyApgcode.ts";

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
    "xq4_27deee6",
  ];
  for (const testCase of testCases) {
    assertBack(testCase);
  }
});

// Generate random cells for testing
function generateRandomCells(
  count: number,
  width: number,
  height: number,
): { x: number; y: number }[] {
  const cellMap = new Map<string, { x: number; y: number }>();
  const maxCells = width * height;

  if (count > maxCells) {
    count = maxCells;
  }

  while (cellMap.size < count) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    cellMap.set(`${x},${y}`, { x, y });
  }

  return Array.from(cellMap)
    .map((s) => {
      return s[1];
    })
    .sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });
}

Deno.test("stringifyExtendedWechslerFormat and parseExtendedWechslerFormat roundtrip tests", () => {
  const testCases = [
    [{ x: 0, y: 0 }, { x: 0, y: 39 }],
    [{ x: 0, y: 0 }, { x: 39, y: 0 }],
    [{ x: 0, y: 0 }, { x: 40, y: 0 }],
    [{ x: 0, y: 0 }, { x: 41, y: 0 }],
    [{ x: 0, y: 0 }, { x: 100, y: 0 }],
  ];

  for (const cells of testCases) {
    const formatString = stringifyExtendedWechslerFormat(cells);
    const parsedCells = parseExtendedWechslerFormat(formatString);
    assertEquals(parsedCells, cells);
  }
});

Deno.test("stringifyExtendedWechslerFormat and parseExtendedWechslerFormat roundtrip random", () => {
  for (let i = 0; i < 100; i++) { // Run multiple random tests
    const randomCells = generateRandomCells(100, 100, 100);
    if (randomCells.length === 0) {
      continue;
    }

    try {
      const formatString = stringifyExtendedWechslerFormat(randomCells);
      const parsedCellsRaw = parseExtendedWechslerFormat(formatString);

      // parse returns CACell[], need to strip state for comparison
      const parsedCells = parsedCellsRaw.map(({ x, y }) => ({ x, y }));

      // stringify normalizes coordinates, so we need to normalize original cells for comparison
      const normalizedOriginalCells = cellsOffsetZero(randomCells);

      assertEquals(parsedCells, normalizedOriginalCells);
    } catch (error) {
      throw error;
    }
  }
});
