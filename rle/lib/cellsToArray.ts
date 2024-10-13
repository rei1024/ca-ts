import type { CACell } from "../RLE.ts";
import { getSizeOfCells } from "./getSizeOfCells.ts";

/**
 * Convert a list of cells to a two-dimensional array.
 * @example
 * ```ts
import { parseRLE, cellsToArray } from "@ca-ts/rle";
const rle = parseRLE(`x = 3, y = 3, rule = B3/S23\nbob$2bo$3o!`);
const { array, size } = cellsToArray(rle.cells);
// array = [ [ 0, 1, 0 ], [ 0, 0, 1 ], [ 1, 1, 1 ] ]
// size = { width: 3, height: 3 }
 * ```
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
