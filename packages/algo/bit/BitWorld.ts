import { BitGrid } from "./BitGrid.ts";
import { createINTNextCell } from "./int/mod.ts";
import {
  createTotalisticNextCell,
  nextCellConway,
} from "./internal/bitwise.ts";
import { createMAPNextCell } from "./map/mod.ts";

function mod(i: number, j: number): number {
  const k = i % j;
  return k < 0 ? k + (j < 0 ? -j : j) : k;
}

/**
 * Outer-totalistic and isotropic non-totalistic cellular automata.
 */
export class BitWorld {
  private _bitGrid: BitGrid;
  private tempArray: Uint32Array;
  private nextCell: typeof nextCellConway;
  /**
   * Create {@link BitWorld}
   *
   * Default transition is Conway's Game of Life.
   */
  constructor(
    bitGrid: BitGrid,
  ) {
    this._bitGrid = bitGrid;
    this.tempArray = new Uint32Array(
      bitGrid.asInternalUint32Array().length,
    );

    this.nextCell = nextCellConway;
  }

  /**
   * Get the underlying {@link BitGrid} instance.
   */
  get bitGrid(): BitGrid {
    return this._bitGrid;
  }

  /**
   * Set a outer-totalistic rule.
   *
   * Example: (B3/S23)
   * ```
   * bitWorld.setRule({ birth: [3], survive: [2, 3] });
   * ```
   */
  setRule(transition: { birth: number[]; survive: number[] } | null) {
    function sortUnique(a: number[]) {
      return [...new Set(a.slice().sort((a, b) => a - b))];
    }

    const normalizedBirth = transition ? sortUnique(transition.birth) : null;

    const normalizedSurvive = transition
      ? sortUnique(transition.survive)
      : null;

    const isConway = transition == null ||
      (normalizedBirth && normalizedBirth.length === 1 &&
        normalizedBirth[0] === 3 &&
        normalizedSurvive && normalizedSurvive.length === 2 &&
        normalizedSurvive[0] === 2 && normalizedSurvive[1] === 3);

    this.nextCell = isConway
      ? nextCellConway
      : createTotalisticNextCell(transition);
  }

  /**
   * Set a isotropic non-totalistic rule.
   *
   * Example: (B3k/S4i)
   * ```
   * bitWorld.setRule({ birth: ["3k"], survive: ["4i"] });
   * ```
   */
  setINTRule(intTransition: { birth: string[]; survive: string[] }) {
    this.nextCell = createINTNextCell(intTransition);
  }

  /**
   * Set MAP rule.
   * @param data 512 bits table
   */
  setMAPRule(data: (0 | 1)[]) {
    this.nextCell = createMAPNextCell(data);
  }

  /**
   * Set a bit grid.
   */
  setBitGrid(bitGrid: BitGrid) {
    this._bitGrid = bitGrid;
    this.tempArray = new Uint32Array(bitGrid.asInternalUint32Array().length);
  }

  /**
   * Create {@link BitWorld}
   *
   * width is rounded up to 32
   */
  static make(
    { width, height }: {
      /**
       * Actual width is ceil(width / 32) * 32
       * @example 32
       */
      width: number;
      height: number;
    },
  ): BitWorld {
    return new BitWorld(BitGrid.make({ width, height }));
  }

  getWidth(): number {
    return this._bitGrid.getWidth();
  }

  getHeight(): number {
    return this._bitGrid.getHeight();
  }

  /**
   * Clear world.
   */
  clear() {
    this._bitGrid.clear();
  }

  /** Fill random states */
  random() {
    this._bitGrid.random();
  }

  /**
   * set live cell at (x, y)
   */
  set(x: number, y: number) {
    this._bitGrid.set(x, y);
  }

  /**
   * Returns the entire grid as a 2D array of 0s and 1s.
   */
  getArray(): (0 | 1)[][] {
    return this._bitGrid.getArray();
  }

  /**
   * Iterates over all cells in the grid, calling the provided function for each cell.
   */
  forEach(fn: (x: number, y: number, alive: 0 | 1) => void) {
    this._bitGrid.forEach(fn);
  }

  /**
   * Iterates over only the "alive" cells in the grid, calling the provided function
   * for each alive cell.  This is more efficient than `forEach` if the grid is sparse.
   */
  forEachAlive(fn: (x: number, y: number) => void) {
    this._bitGrid.forEachAlive(fn);
  }

  getCellArray(): { x: number; y: number }[] {
    const array: { x: number; y: number }[] = [];
    this._bitGrid.forEachAlive((x, y) => {
      array.push({ x, y });
    });

    return array;
  }

  /**
   * Update to next generation
   */
  next() {
    const bitGrid = this._bitGrid;
    const width = bitGrid.getWidth32();
    const height = bitGrid.getHeight();
    const array = bitGrid.asInternalUint32Array();
    const next = this.nextCell;

    const tempArray = this.tempArray;
    for (let i = 0; i < height; i++) {
      const up = mod(i - 1, height) * width;
      const middle = i * width;
      const down = ((i + 1) % height) * width;
      for (let j = 0; j < width; j++) {
        const left = j === 0 ? width - 1 : (j - 1) % width;
        const right = (j + 1) % width;
        const ne = array[up + left]!;
        const n = array[up + j]!;
        const nw = array[up + right]!;
        const w = array[middle + right]!;
        const e = array[middle + left]!;
        const sw = array[down + right]!;
        const s = array[down + j]!;
        const se = array[down + left]!;
        const middleOffset = middle + j;
        const center = array[middleOffset]!;
        tempArray[middleOffset] = next(center, ne, n, nw, e, w, se, s, sw);
      }
    }

    array.set(tempArray);
  }

  /**
   * Checks if there are any live cells at the border of the grid.
   */
  hasAliveCellAtBorder(): boolean {
    return this.bitGrid.hasAliveCellAtBorder();
  }

  /**
   * Gets the population (number of live cells) in the grid.
   */
  getPopulation(): number {
    return this.bitGrid.getPopulation();
  }
}
