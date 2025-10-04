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

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
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
    this.array[y * this.width + x] = 1;
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
   * 次の世代に更新する
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
