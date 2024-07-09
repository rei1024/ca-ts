import type { CACell } from "./RLE.ts";
import { getSizeOfCells } from "./getSizeOfCells.ts";

/**
 * @param cells RLE
 * @returns 2 dim array of states
 */
export function cellsToArray(
  cells: CACell[],
): { size: { width: number; height: number }; array: number[][] } {
  const size = getSizeOfCells(cells);

  const array = Array(size.height).fill(0).map(() =>
    Array(size.width).fill(0).map(() => 0)
  );
  for (const cell of cells) {
    const row = array[cell.position.y];
    if (row === undefined) {
      throw new Error("internal error");
    }
    row[cell.position.x] = cell.state;
  }

  return {
    size,
    array,
  };
}
