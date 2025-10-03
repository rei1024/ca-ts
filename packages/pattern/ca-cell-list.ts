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
 * assertEquals(cellList.population, 3);
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

  /**
   * Construct from list of cells.
   */
  static fromCells(cells: readonly CACell[]): CACellList {
    return new CACellList(cells, false);
  }

  /**
   * Get list of cells.
   */
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

  /**
   * Gets the population (number of live cells).
   */
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
    options?: { readonly backgroundState?: number },
  ): {
    array: number[][];
    size: { width: number; height: number };
    offset: { dx: number; dy: number };
  } | null {
    const cells = this.getCells();
    if (cells.length === 0) {
      return null;
    }

    const boundingRect = this.boundingRect!;

    const minX = boundingRect.minX;
    const minY = boundingRect.minY;

    if (!Number.isInteger(minX) || !Number.isInteger(minY)) {
      throw new Error("invalid position");
    }

    const width = boundingRect.width;
    const height = boundingRect.height;

    if (!Number.isInteger(width) || !Number.isInteger(height)) {
      throw new Error("invalid position");
    }

    const backgroundState = options?.backgroundState ?? BACKGROUND_STATE;
    const array = Array.from(
      { length: height },
      () => Array.from({ length: width }, () => backgroundState),
    );

    for (const cell of cells) {
      const cellPosition = cell.position;
      array[cellPosition.y - minY]![cellPosition.x - minX] = cell.state;
    }

    return {
      array,
      size: boundingRect.size,
      offset: { dx: minX, dy: minY },
    };
  }

  /**
   * Convert a two-dimensional array to a {@link CACellList}.
   * @param array
   * @param offset
   * @returns
   */
  static from2dArray(
    array: ReadonlyArray<ReadonlyArray<number>>,
    offset?: { readonly dx: number; readonly dy: number },
  ): CACellList {
    const cells: CACell[] = [];
    const height = array.length;
    const yOffset = offset?.dy ?? 0;
    const xOffset = offset?.dx ?? 0;
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

  /**
   * Creates a new `CACellList` by applying a provided function to each `CACell`
   * in the current list.
   */
  map(fn: (cell: CACell) => CACell): CACellList {
    return this.mapInternal(fn, false);
  }

  /**
   * Translate the cells by a given offset.
   *
   * @example
   * ```ts
   * import { CACellList } from "@ca-ts/pattern";
   * import { assertEquals } from "@std/assert";
   *
   * const cellList = CACellList.fromCells([{ position: { x: 3, y: 2 }, state: 1 }])
   * assertEquals(
   *   cellList.translate({ dx: 1, dy: -1 }).getCells(),
   *   [{ position: { x: 4, y: 1 }, state: 1 }]
   * );
   * ```
   */
  translate(offset: { readonly dx: number; readonly dy: number }): CACellList {
    const { dx, dy } = offset;
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
    const aPosition = a.position;
    const bPosition = b.position;
    const aY = aPosition.y;
    const bY = bPosition.y;
    if (aY === bY) {
      return aPosition.x - bPosition.x;
    } else {
      return aY - bY;
    }
  });
}

function uniqueCells(sortedCells: readonly CACell[]): CACell[] {
  let prevCell: CACell | null = null;
  const cells: CACell[] = [];
  const len = sortedCells.length;
  for (let i = 0; i < len; i++) {
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
