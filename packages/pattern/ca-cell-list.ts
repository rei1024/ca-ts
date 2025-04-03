import { type BoundingRect, rectFromCells } from "./bounding-rect.ts";
import type { CACell } from "./mod.ts";

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

  private constructor(cells: readonly CACell[]) {
    // Remove background cells
    cells = cells.filter((cell) => cell.state !== 0);
    this.cells = cells;
  }

  static fromCells(cells: readonly CACell[]): CACellList {
    return new CACellList(cells);
  }

  private _sortedCells: CACell[] | null = null;
  getCells(): readonly CACell[] {
    if (this._sortedCells === null) {
      this._sortedCells = sortCells(this.cells);
    }
    return this._sortedCells;
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
    return this.cells.length;
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
    if (this.cells.length === 0) {
      return null;
    }

    const boundingRect = this.boundingRect!;

    const minX = boundingRect.minX;
    const minY = boundingRect.minY;

    const width = boundingRect.width;
    const height = boundingRect.height;

    const backgroundState = options?.backgroundState ?? 0;
    const array = Array.from(
      { length: height },
      () => Array.from({ length: width }, () => backgroundState),
    );

    for (const cell of this.cells) {
      array[cell.position.y - minY]![cell.position.x - minX] = cell.state;
    }

    return {
      array,
      size: boundingRect.size,
      offset: { x: minX, y: minY },
    };
  }
}

function sortCells(cells: readonly CACell[]): CACell[] {
  return cells.slice().sort((a, b) => {
    if (a.position.y === b.position.y) {
      return a.position.x - b.position.x;
    } else {
      return a.position.y - b.position.y;
    }
  });
}
