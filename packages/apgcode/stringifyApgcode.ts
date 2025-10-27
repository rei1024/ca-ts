import type { Apgcode } from "./Apgcode.ts";

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

type RowData = { y: number; data: { x: number; y: number }[] };

function cellsOffsetZero(
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
export function stringifyExtendedWechslerFormat(
  cells: { x: number; y: number }[],
): string {
  validate(cells);

  if (cells.length === 0) {
    throw new Error("empty pattern");
  }

  // TODO
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
