import type { CACell } from "../mod.ts";

export function getSizeOfCells(
  cells: CACell[],
): { width: number; height: number } {
  if (cells.length === 0) {
    return { width: 0, height: 0 };
  }

  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const cell of cells) {
    maxX = Math.max(maxX, cell.position.x);
    maxY = Math.max(maxY, cell.position.y);
  }

  return {
    width: maxX + 1,
    height: maxY + 1,
  };
}
