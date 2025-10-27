import type { Apgcode } from "./Apgcode.ts";
import { numToChar, numToCharForY } from "./internal/numToChar.ts";

/**
 * Convert Apgcode object back to apgcode string.
 *
 * NOTE: this function does not compute minimal representation.
 */
export function stringifyApgcode(apgcode: Apgcode): string {
  switch (apgcode.type) {
    case "still-life": {
      return `xs${apgcode.population}_${
        stringifyExtendedWechslerFormat(apgcode.cells)
      }`;
    }
    case "oscillator": {
      return `xp${apgcode.period}_${
        stringifyExtendedWechslerFormat(apgcode.cells)
      }`;
    }
    case "spaceship": {
      return `xq${apgcode.period}_${
        stringifyExtendedWechslerFormat(apgcode.cells)
      }`;
    }
    case "linear": {
      return `yl${apgcode.populationGrowthPeriod}_${apgcode.debrisPeriod}_${apgcode.populationGrowthAmount}_${apgcode.hash}`;
    }
  }
}

export function cellsOffsetZero(
  cells: { x: number; y: number }[],
): { x: number; y: number }[] {
  if (cells.length === 0) {
    return cells;
  }
  const minX = cells.reduce((acc, cell) => Math.min(acc, cell.x), Infinity);
  const minY = cells.reduce((acc, cell) => Math.min(acc, cell.y), Infinity);
  return cells.map((cell) => ({ x: cell.x - minX, y: cell.y - minY }));
}

// opposite of parseExtendedWechslerFormat
/**
 * NOTE: this function does not compute minimal representation.
 */
export function stringifyExtendedWechslerFormat(
  cells: { x: number; y: number }[],
): string {
  validate(cells);

  if (cells.length === 0) {
    throw new Error("empty pattern");
  }

  const normalizedCells = cellsOffsetZero(cells);

  if (normalizedCells.length === 0) {
    return "";
  }

  const maxY = normalizedCells.reduce((max, cell) => Math.max(max, cell.y), 0);
  const numStrips = Math.floor(maxY / 5) + 1;
  const strips: string[] = [];

  for (let i = 0; i < numStrips; i++) {
    const stripCells = normalizedCells.filter(
      (cell) => Math.floor(cell.y / 5) === i,
    );

    if (stripCells.length === 0) {
      strips.push("");
      continue;
    }

    const maxX = stripCells.reduce((max, cell) => Math.max(max, cell.x), 0);
    const columnValues: number[] = new Array(maxX + 1).fill(0);

    for (const cell of stripCells) {
      const bit = 1 << (cell.y % 5);
      columnValues[cell.x]! |= bit;
    }

    let lastNonZero = columnValues.length - 1;
    while (lastNonZero >= 0 && columnValues[lastNonZero] === 0) {
      lastNonZero--;
    }
    if (lastNonZero < 0) {
      strips.push("");
      continue;
    }
    const trimmedColumnValues = columnValues.slice(0, lastNonZero + 1);

    let stripStr = "";
    let zeroCount = 0;

    for (const value of trimmedColumnValues) {
      if (value === 0) {
        zeroCount++;
      } else {
        stripStr += numToCharForY(zeroCount);
        zeroCount = 0;
        stripStr += numToChar(value);
      }
    }

    strips.push(stripStr);
  }

  return strips.join("z").replace(/z*$/, "");
}

function validate(cells: { x: number; y: number }[]) {
  let prevCell = undefined;
  for (const cell of cells) {
    if (!Number.isInteger(cell.x) || !Number.isInteger(cell.y)) {
      throw new Error("Not an integer");
    }
    if (
      prevCell &&
      (prevCell.y > cell.y || (prevCell.y === cell.y && prevCell.x > cell.x))
    ) {
      throw new Error("Not sorted and unique");
    }
    prevCell = cell;
  }
}
