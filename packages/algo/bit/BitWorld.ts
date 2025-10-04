import { BitGrid } from "./BitGrid.ts";
import { createINTNextCell } from "./int/mod.ts";
import {
  createTotalisticNextCell,
  nextCellConway,
} from "./internal/bitwise.ts";
import { isLifeTransition } from "./internal/is-life-transition.ts";
import { createMAPNextCell } from "./map/mod.ts";
import { createVonNeumannNextCell } from "./von-ot/mod.ts";

function mod(i: number, j: number): number {
  const k = i % j;
  return k < 0 ? k + (j < 0 ? -j : j) : k;
}

const MOORE_NEIGHBORHOOD = 0;
const VON_NEUMANN_NEIGHBORHOOD = 1;

/**
 * A optimized simulator for 2-state cellular automata on a 2D grid.
 * It supports various rule types, including Conway's Game of Life, other
 * outer-totalistic rules, isotropic non-totalistic rules, and non-isotropic
 * (MAP) rules.
 *
 * The world is toroidal, meaning the edges wrap around.
 */
export class BitWorld {
  private _bitGrid: BitGrid;
  private tempArray: Uint32Array;
  private nextCell: typeof nextCellConway;
  private nextVonCell:
    | ((
      center: number,
      n: number,
      e: number,
      s: number,
      w: number,
    ) => number)
    | undefined;
  private neighborhood:
    | typeof MOORE_NEIGHBORHOOD
    | typeof VON_NEUMANN_NEIGHBORHOOD;

  /**
   * Creates a new `BitWorld` instance.
   * The default transition rule is Conway's Game of Life.
   *
   * @param bitGrid The underlying {@link BitGrid} to use for the world.
   */
  constructor(
    bitGrid: BitGrid,
  ) {
    this._bitGrid = bitGrid;
    this.tempArray = new Uint32Array(
      bitGrid.asInternalUint32Array().length,
    );

    this.nextCell = nextCellConway;
    this.neighborhood = MOORE_NEIGHBORHOOD;
  }

  /**
   * Gets the underlying {@link BitGrid} instance.
   */
  get bitGrid(): BitGrid {
    return this._bitGrid;
  }

  /**
   * Sets an outer-totalistic rule for the simulation.
   * If `null` is passed, it defaults to Conway's Game of Life (B3/S23).
   *
   * @param transition An object with `birth` and `survive` arrays.
   * @example
   * // HighLife (B36/S23)
   * world.setRule({ birth: [3, 6], survive: [2, 3] });
   */
  setRule(transition: { birth: number[]; survive: number[] } | null) {
    this.nextCell = transition == null || isLifeTransition(transition)
      ? nextCellConway
      : createTotalisticNextCell(transition);
    this.nextVonCell = undefined;
    this.neighborhood = MOORE_NEIGHBORHOOD;
  }

  /**
   * Sets an isotropic non-totalistic (INT) rule for the simulation.
   *
   * Use `@ca-ts/rule` package to parse a rule string into the required format.
   *
   * @param intTransition An object with `birth` and `survive` arrays of INT rule strings.
   * @example
   * // Just Friends (B2-a/S12)
   * world.setINTRule({
   *   birth: ["2c", "2e", "2i", "2k", "2n"],
   *   survive: ["1c", "1e", "2a", "2c", "2e", "2i", "2k", "2n"],
   * });
   */
  setINTRule(intTransition: { birth: string[]; survive: string[] }) {
    this.nextCell = createINTNextCell(intTransition);
    this.nextVonCell = undefined;
    this.neighborhood = MOORE_NEIGHBORHOOD;
  }

  /**
   * Sets a non-isotropic (MAP) rule from a 512-bit transition table.
   * @param data An array of 512 bits (0 or 1) representing the transition table.
   */
  setMAPRule(data: (0 | 1)[]) {
    this.nextCell = createMAPNextCell(data);
    this.nextVonCell = undefined;
    this.neighborhood = MOORE_NEIGHBORHOOD;
  }

  /**
   * Set von Neumann neighbourhood outer totalistic rule
   */
  setVonNeumannOTRule(transition: { birth: number[]; survive: number[] }) {
    this.nextVonCell = createVonNeumannNextCell(transition);
    this.neighborhood = VON_NEUMANN_NEIGHBORHOOD;
  }

  /**
   * Replaces the underlying bit grid with a new one.
   * @param bitGrid The new {@link BitGrid} to use.
   */
  setBitGrid(bitGrid: BitGrid) {
    this._bitGrid = bitGrid;
    this.tempArray = new Uint32Array(bitGrid.asInternalUint32Array().length);
  }

  /**
   * Creates a new `BitWorld` instance with a new {@link BitGrid}.
   * The width is rounded up to the nearest multiple of 32.
   *
   * @param dimensions The width and height of the world.
   */
  static make(
    { width, height }: {
      /**
       * The desired width of the world.
       * The actual width will be `ceil(width / 32) * 32`.
       * @example 32
       */
      width: number;
      height: number;
    },
  ): BitWorld {
    return new BitWorld(BitGrid.make({ width, height }));
  }

  /**
   * Gets the width of the world.
   */
  getWidth(): number {
    return this._bitGrid.getWidth();
  }

  /**
   * Gets the height of the world.
   */
  getHeight(): number {
    return this._bitGrid.getHeight();
  }

  /**
   * Clears the world, setting all cells to the dead state.
   */
  clear() {
    this._bitGrid.clear();
  }

  /**
   * Fills the world with a random pattern of live and dead cells.
   */
  random() {
    this._bitGrid.random();
  }

  /**
   * Sets a cell at the given coordinates to the alive state.
   * @param x The x-coordinate of the cell.
   * @param y The y-coordinate of the cell.
   */
  set(x: number, y: number) {
    this._bitGrid.set(x, y);
  }

  /**
   * Returns the entire grid as a 2D array of 0s (dead) and 1s (alive).
   */
  getArray(): (0 | 1)[][] {
    return this._bitGrid.getArray();
  }

  /**
   * Iterates over all cells in the grid.
   * @param fn The function to call for each cell, receiving `x`, `y`, and `alive` state.
   */
  forEach(fn: (x: number, y: number, alive: 0 | 1) => void) {
    this._bitGrid.forEach(fn);
  }

  /**
   * Iterates over only the "alive" cells in the grid. This is more efficient
   * than `forEach` if the grid is sparse.
   * @param fn The function to call for each alive cell, receiving `x` and `y`.
   */
  forEachAlive(fn: (x: number, y: number) => void) {
    this._bitGrid.forEachAlive(fn);
  }

  /**
   * Returns an array of objects, each containing the `x` and `y` coordinates of a live cell.
   */
  getCellArray(): { x: number; y: number }[] {
    const array: { x: number; y: number }[] = [];
    this._bitGrid.forEachAlive((x, y) => {
      array.push({ x, y });
    });

    return array;
  }

  next() {
    switch (this.neighborhood) {
      case MOORE_NEIGHBORHOOD: {
        this.nextMoore();
        break;
      }
      case VON_NEUMANN_NEIGHBORHOOD: {
        this.nextVon();
        break;
      }
    }
  }

  /**
   * Advances the simulation to the next generation, updating all cells according
   * to the current rule.
   */
  private nextMoore() {
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
   * Advances the simulation to the next generation, updating all cells according
   * to the current rule.
   */
  private nextVon() {
    const bitGrid = this._bitGrid;
    const width = bitGrid.getWidth32();
    const height = bitGrid.getHeight();
    const array = bitGrid.asInternalUint32Array();
    const next = this.nextVonCell;
    if (next === undefined) {
      throw new Error("Internal error");
    }

    const tempArray = this.tempArray;
    for (let i = 0; i < height; i++) {
      const up = mod(i - 1, height) * width;
      const middle = i * width;
      const down = ((i + 1) % height) * width;
      for (let j = 0; j < width; j++) {
        const left = j === 0 ? width - 1 : (j - 1) % width;
        const right = (j + 1) % width;
        const n = array[up + j]!;
        const w = array[middle + right]!;
        const e = array[middle + left]!;
        const s = array[down + j]!;
        const middleOffset = middle + j;
        const center = array[middleOffset]!;
        tempArray[middleOffset] = next(center, n, e, s, w);
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
   * Gets the total number of live cells in the grid.
   */
  getPopulation(): number {
    return this.bitGrid.getPopulation();
  }
}
