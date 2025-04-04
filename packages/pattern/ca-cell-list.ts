import { type BoundingRect, rectFromCells } from "./bounding-rect.ts";
import type { CACell } from "./mod.ts";

// dead cell
const BACKGROUND_STATE = 0;

/**
 * A list of cells in a cellular automaton.
 *
 * This class is used to represent a list of cells in a cellular automaton.
 * It provides methods to manipulate and access the cells.
 *
 * @example
 * ```ts
 * import { CACellList } from "@ca-ts/pattern";
 * import { assertEquals } from "@std/assert";
 *
 * const cells = [
 *   { position: { x: 0, y: 0 }, state: 1 },
 *   { position: { x: 1, y: 0 }, state: 2 },
 *   { position: { x: 2, y: 0 }, state: 3 },
 * ]
 * const cellList = CACellList.fromCells(cells);
 *
 * assertEquals(cellList.boundingRect?.width, 3);
 * assertEquals(cellList.boundingRect?.height, 1);
 * ```
 */
export class CACellList {
  private cells: readonly CACell[];
  private isSortedUnique: boolean;

  private constructor(cells: readonly CACell[], isSortedUnique: boolean) {
    // Remove background cells
    cells = cells.filter((cell) => cell.state !== BACKGROUND_STATE);
    this.cells = cells;
    this.isSortedUnique = isSortedUnique;
  }

  static fromCells(cells: readonly CACell[]): CACellList {
    return new CACellList(cells, false);
  }

  getCells(): readonly CACell[] {
    if (this.isSortedUnique) {
      return this.cells;
    }
    this.cells = uniqueCells(sortCells(this.cells));
    this.isSortedUnique = true;
    return this.cells;
  }

  // undefined is uninitialized, null is empty pattern
  private _boundingRectCache: BoundingRect | undefined | null = undefined;
  get boundingRect(): BoundingRect | null {
    let value = this._boundingRectCache;
    if (value === undefined) {
      value = rectFromCells(this.cells) ?? null;
      this._boundingRectCache = value;
    }
    return value;
  }

  get population(): number {
    return this.getCells().length;
  }

  /**
   * Convert to a two-dimensional array.
   *
   * @example
   * ```ts
   * import { CACellList } from "@ca-ts/pattern";
   * const cells = [
   *   { position: { x: 0, y: 0 }, state: 1 },
   *   { position: { x: 1, y: 0 }, state: 2 },
   *   { position: { x: 2, y: 0 }, state: 3 },
   * ]
   * const cellList = CACellList.fromCells(cells);
   * const array = cellList.to2dArray();
   * // array.array = [
   * //   [1, 2, 3],
   * // ]
   */
  to2dArray(
    options?: { backgroundState?: number },
  ): {
    array: number[][];
    size: { width: number; height: number };
    offset: { x: number; y: number };
  } | null {
    const cells = this.getCells();
    if (cells.length === 0) {
      return null;
    }

    const boundingRect = this.boundingRect!;

    const minX = boundingRect.minX;
    const minY = boundingRect.minY;

    const width = boundingRect.width;
    const height = boundingRect.height;

    const backgroundState = options?.backgroundState ?? BACKGROUND_STATE;
    const array = Array.from(
      { length: height },
      () => Array.from({ length: width }, () => backgroundState),
    );

    for (const cell of cells) {
      array[cell.position.y - minY]![cell.position.x - minX] = cell.state;
    }

    return {
      array,
      size: boundingRect.size,
      offset: { x: minX, y: minY },
    };
  }

  /**
   * Convert a two-dimensional array to a {@link CACellList}.
   * @param array
   * @param offset
   * @returns
   */
  static from2dArray(
    array: number[][],
    offset?: { x: number; y: number },
  ): CACellList {
    const cells: CACell[] = [];
    const height = array.length;
    const yOffset = offset?.y ?? 0;
    const xOffset = offset?.x ?? 0;
    for (let y = 0; y < height; y++) {
      const row = array[y]!;
      for (let x = 0; x < row.length; x++) {
        const state = row[x]!;
        if (state !== BACKGROUND_STATE) {
          cells.push({
            position: { x: x + xOffset, y: y + yOffset },
            state,
          });
        }
      }
    }

    return new CACellList(cells, true);
  }

  private mapInternal(
    fn: (cell: CACell) => CACell,
    fnIsOrderPreserving: boolean,
  ): CACellList {
    return new CACellList(
      this.cells.map(fn),
      this.isSortedUnique ? fnIsOrderPreserving : false,
    );
  }

  map(fn: (cell: CACell) => CACell): CACellList {
    return this.mapInternal(fn, false);
  }

  /**
   * Translate the cells by a given offset.
   */
  translate({ dx, dy }: { dx: number; dy: number }): CACellList {
    return this.mapInternal((cell) => ({
      ...cell,
      position: {
        x: cell.position.x + dx,
        y: cell.position.y + dy,
      },
    }), true);
  }

  equals(other: CACellList): boolean {
    if (this === other) {
      return true;
    }

    const thisCells = this.getCells();
    const otherCells = other.getCells();

    if (thisCells.length !== otherCells.length) {
      return false;
    }

    const len = thisCells.length;

    for (let i = 0; i < len; i++) {
      const thisCell = thisCells[i]!;
      const otherCell = otherCells[i]!;
      if (
        thisCell.position.y !== otherCell.position.y ||
        thisCell.position.x !== otherCell.position.x ||
        thisCell.state !== otherCell.state
      ) {
        return false;
      }
    }
    return true;
  }
}

function sortCells(cells: readonly CACell[]): CACell[] {
  return cells.slice().sort((a, b) => {
    const aY = a.position.y;
    const bY = b.position.y;
    if (aY === bY) {
      return a.position.x - b.position.x;
    } else {
      return aY - bY;
    }
  });
}

function uniqueCells(sortedCells: readonly CACell[]): CACell[] {
  let prevCell: CACell | null = null;
  const cells: CACell[] = [];
  for (let i = 0; i < sortedCells.length; i++) {
    const cell = sortedCells[i]!;
    if (
      !(prevCell && prevCell.position.x === cell.position.x &&
        prevCell.position.y === cell.position.y)
    ) {
      cells.push(cell);
    }
    prevCell = cell;
  }
  return cells;
}
