import { BitGrid } from "./BitGrid.ts";
import { nextCell } from "./internal/bitwise.ts";

function mod(i: number, j: number): number {
  const k = i % j;
  return k < 0 ? k + (j < 0 ? -j : j) : k;
}

/**
 * Game of Life
 *
 * using bitwise operations
 */
export class BitWorld {
  public bitGrid: BitGrid;
  private tempArray: Uint32Array;

  constructor(bitGrid: BitGrid) {
    this.bitGrid = bitGrid;
    this.tempArray = new Uint32Array(
      this.bitGrid.asInternalUint32Array().length,
    );
  }

  /**
   * Create {@link BitWorld}
   *
   * width is rounded up to 32
   */
  static make({ width, height }: {
    /**
     * Actual width is ceil(width / 32) * 32
     */
    width: number;
    height: number;
  }): BitWorld {
    return new BitWorld(BitGrid.make({ width, height }));
  }

  getWidth(): number {
    return this.bitGrid.getWidth();
  }

  getHeight(): number {
    return this.bitGrid.getHeight();
  }

  clear() {
    this.bitGrid.clear();
  }

  /** Fill random states */
  random() {
    this.bitGrid.random();
  }

  /**
   * set alive cell at (x, y)
   */
  set(x: number, y: number) {
    this.bitGrid.set(x, y);
  }

  getArray(): (0 | 1)[][] {
    return this.bitGrid.getArray();
  }

  forEach(fn: (x: number, y: number, alive: 0 | 1) => void) {
    this.bitGrid.forEach(fn);
  }

  forEachAlive(fn: (x: number, y: number) => void) {
    this.bitGrid.forEachAlive(fn);
  }

  getCellArray(): { x: number; y: number }[] {
    const array: { x: number; y: number }[] = [];
    this.bitGrid.forEachAlive((x, y) => {
      array.push({ x, y });
    });

    return array;
  }

  /**
   * update to next generation
   */
  next() {
    const width = this.bitGrid.getWidth32();
    const height = this.bitGrid.getHeight();
    const array = this.bitGrid.asInternalUint32Array();
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
        tempArray[middleOffset] = nextCell(center, ne, n, nw, e, w, se, s, sw);
      }
    }

    array.set(tempArray);
  }

  /**
   * has alive cell at border
   */
  hasAliveCellAtBorder(): boolean {
    return this.bitGrid.hasAliveCellAtBorder();
  }

  /**
   * Population
   */
  getPopulation(): number {
    return this.bitGrid.getPopulation();
  }
}
