import { intConditionList } from "../int/mod.ts";
import { isLifeTransition } from "../internal/is-life-transition.ts";

function mod(i: number, j: number) {
  const k = i % j;
  return k < 0 ? (k + (j < 0 ? -j : j)) : k;
}

type CellState = 0 | 1;

type NextCellFn = (
  center: CellState,
  ne: CellState,
  n: CellState,
  nw: CellState,
  e: CellState,
  w: CellState,
  se: CellState,
  s: CellState,
  sw: CellState,
) => CellState;

/**
 * Rule of Conway's Game of Life
 * @param cell state of center cell
 * @param count number of neighbor live cell
 * @returns next state of center cell
 */
const updateLifeCell: NextCellFn = (
  center: CellState,
  ne: CellState,
  n: CellState,
  nw: CellState,
  e: CellState,
  w: CellState,
  se: CellState,
  s: CellState,
  sw: CellState,
): CellState => {
  const count = ne + n + nw + e + w + se + s + sw;
  if (center === 0 && count === 3) {
    return 1;
  } else if (center === 1 && (count === 2 || count === 3)) {
    return 1;
  } else {
    return 0;
  }
};

function createOTNextCell(
  transition: { birth: number[]; survive: number[] },
): (
  center: CellState,
  ne: CellState,
  n: CellState,
  nw: CellState,
  e: CellState,
  w: CellState,
  se: CellState,
  s: CellState,
  sw: CellState,
) => CellState {
  const birthSet = new Set(transition.birth);
  const surviveSet = new Set(transition.survive);
  return (cell, ne, n, nw, e, w, se, s, sw) => {
    const count = ne + n + nw + e + w + se + s + sw;
    return (cell === 0 ? birthSet.has(count) : surviveSet.has(count)) ? 1 : 0;
  };
}

function createVonOTNextCell(
  transition: { birth: number[]; survive: number[] },
): (
  center: CellState,
  ne: CellState,
  n: CellState,
  nw: CellState,
  e: CellState,
  w: CellState,
  se: CellState,
  s: CellState,
  sw: CellState,
) => CellState {
  if (
    transition.birth.some((x) => x > 4) || transition.survive.some((x) => x > 4)
  ) {
    throw new Error("count should be less than 5 for von Neumann neighborhood");
  }
  const birthSet = new Set(transition.birth);
  const surviveSet = new Set(transition.survive);
  return (cell, ne, n, nw, e, w, se, s, sw) => {
    const count = n + e + w + s;
    return (cell === 0 ? birthSet.has(count) : surviveSet.has(count)) ? 1 : 0;
  };
}

function createINTNextCell(
  transition: { birth: string[]; survive: string[] },
): (
  center: CellState,
  ne: CellState,
  n: CellState,
  nw: CellState,
  e: CellState,
  w: CellState,
  se: CellState,
  s: CellState,
  sw: CellState,
) => CellState {
  const birth = transition.birth;
  const survive = transition.survive;

  if (birth.includes("0")) {
    throw new Error("B0 rule");
  }

  const lookupTableBirth = new Uint8Array(256);
  const lookupTableSurvive = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    const condition = intConditionList[i] ?? "";
    lookupTableBirth[i] = birth.includes(condition) ? 1 : 0;
    lookupTableSurvive[i] = survive.includes(condition) ? 1 : 0;
  }

  // 1   2   4
  // 8      16
  // 32 64 128
  /**
   * ```txt
   * ne n nw
   * e  c  w
   * se s sw
   * ```
   */

  return (cell, ne, n, nw, e, w, se, s, sw) => {
    const index = ne + (n << 1) + (nw << 2) + (e << 3) + (w << 4) + (se << 5) +
      (s << 6) + (sw << 7);
    return (cell === 0 ? lookupTableBirth : lookupTableSurvive)[index] ? 1 : 0;
  };
}

/**
 * Game of Life
 */
export class World {
  private width: number;
  private height: number;
  private array: Uint8Array;
  private tempArray: Uint8Array;
  private nextCell = updateLifeCell;
  private neighborhood: "moore" | "von" = "moore";
  /**
   * @param width
   * @param height
   */
  constructor(width: number, height: number) {
    if (typeof width !== "number") {
      throw TypeError("width is not a number");
    }

    this.width = width;
    this.height = height;
    const len = width * height;

    this.array = new Uint8Array(len);
    this.tempArray = new Uint8Array(len);
  }

  static make({ width, height }: { width: number; height: number }) {
    return new World(width, height);
  }

  /**
   * Set outer totalistic rule
   */
  setOTRule(transition: { birth: number[]; survive: number[] }) {
    if (isLifeTransition(transition)) {
      this.nextCell = updateLifeCell;
      return;
    }
    this.nextCell = createOTNextCell(transition);
    this.neighborhood = "moore";
  }

  /**
   * Set von Neumann neighbourhood outer totalistic rule
   */
  setVonNeumannOTRule(transition: { birth: number[]; survive: number[] }) {
    this.nextCell = createVonOTNextCell(transition);
    this.neighborhood = "von";
  }

  setINTRule(transition: { birth: string[]; survive: string[] }) {
    this.nextCell = createINTNextCell(transition);
    this.neighborhood = "moore";
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * set all cells to dead
   */
  clear() {
    this.array.fill(0);
  }

  /**
   * @param x
   * @param y
   */
  set(x: number, y: number) {
    const array = this.array;
    const width = this.width;
    const height = this.height;
    if (x < 0 || x >= width) {
      throw new RangeError("x is out of range");
    }
    if (y < 0 || y >= height) {
      throw new RangeError("x is out of range");
    }
    array[y * width + x] = 1;
  }

  random({ liveRatio }: { liveRatio?: number } = {}) {
    const array = this.array;
    array.forEach((_, i) => {
      array[i] = Math.random() < (liveRatio ?? 0.5) ? 0 : 1;
    });
  }

  getArray() {
    const a: boolean[][] = [];
    this.forEach((x, y, alive) => {
      a[y] ??= [];
      a[y][x] = alive;
    });
    return a;
  }

  forEach(fn: (x: number, y: number, alive: boolean) => void) {
    const width = this.width;
    const height = this.height;
    const array = this.array;
    for (let i = 0; i < height; i++) {
      const middle = i * width;
      for (let j = 0; j < width; j++) {
        fn(j, i, array[middle + j] ? true : false);
      }
    }
  }

  forEachAlive(fn: (x: number, y: number) => void) {
    this.forEach((x, y, alive) => {
      if (alive) {
        fn(x, y);
      }
    });
  }

  /**
   * Advances the simulation to the next generation, updating all cells according
   * to the current rule.
   */
  next() {
    const nextCell = this.nextCell;
    const width = this.width;
    const height = this.height;
    const array = this.array;
    const tempArray = this.tempArray;
    for (let i = 0; i < height; i++) {
      const up = mod(i - 1, height) * width;
      const middle = i * width;
      const down = ((i + 1) % height) * width;
      for (let j = 0; j < width; j++) {
        const left = mod(j - 1, width);
        const right = (j + 1) % width;
        const middleOffset = middle + j;
        /**
         * ```txt
         * ne n nw
         * e  c  w
         * se s sw
         * ```
         */
        const c = array[middleOffset]! as CellState;
        const ne = array[up + left]! as CellState;
        const n = array[up + j]! as CellState;
        const nw = array[up + right]! as CellState;
        const e = array[middle + left]! as CellState;
        const w = array[middle + right]! as CellState;
        const se = array[down + left]! as CellState;
        const s = array[down + j]! as CellState;
        const sw = array[down + right]! as CellState;
        tempArray[middleOffset] = nextCell(
          c,
          ne,
          n,
          nw,
          e,
          w,
          se,
          s,
          sw,
        );
      }
    }

    array.set(tempArray);
  }
}
