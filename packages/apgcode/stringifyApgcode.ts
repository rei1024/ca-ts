import type { Apgcode } from "./Apgcode.ts";

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

export function stringifyExtendedWechslerFormat(
  cells: { x: number; y: number }[],
): string {
  validate(cells);
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
