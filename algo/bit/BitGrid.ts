import type { Rect } from "../common.ts";
import {
  bitAndUint32Array,
  bitCountArrayBuffer,
  bitOrUint32Array,
} from "./internal/bitwise.ts";

const getOffset = (width32: number, iHeight: number, jWidth: number) => {
  return iHeight * width32 + jWidth;
};

export class BitGrid {
  constructor(
    private readonly width32: number,
    private readonly height: number,
    private readonly uint32array: Uint32Array,
  ) {}

  static make({ width, height }: { width: number; height: number }): BitGrid {
    const width32 = Math.ceil(width / 32);
    const len = width32 * height;
    return new BitGrid(width32, height, new Uint32Array(len));
  }

  clone(): BitGrid {
    return new BitGrid(this.width32, this.height, this.uint32array.slice());
  }

  random() {
    const array = this.uint32array;
    if (crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * Math.pow(2, 32));
      }
    }
  }

  clear() {
    this.uint32array.fill(0);
  }

  asInternalUint32Array(): Uint32Array {
    return this.uint32array;
  }

  getWidth(): number {
    return this.width32 * 32;
  }

  getWidth32(): number {
    return this.width32;
  }

  getHeight(): number {
    return this.height;
  }

  /**
   * set alive at (x, y)
   */
  set(x: number, y: number) {
    const offset = x >>> 5; // = Math.floor(x / 32)
    const index = y * this.width32 + offset;
    const array = this.uint32array;
    if (array.length <= index) {
      throw new RangeError(
        `BitGrid.set array.length=${array.length} index=${index} x=${x} y=${y}`,
      );
    }
    array[index] = array[index]! | (1 << (31 - (x % 32)));
  }

  /**
   * get (x, y) cell
   */
  get(x: number, y: number): 0 | 1 {
    const offset = x >>> 5; // = Math.floor(x / 32)
    const index = y * this.width32 + offset;
    const array = this.uint32array;
    if (array.length <= index) {
      throw new RangeError(
        `BitGrid.get array.length=${array.length} index=${index} x=${x} y=${y}`,
      );
    }

    return (array[index]! & (1 << (31 - (x % 32)))) === 0 ? 0 : 1;
  }

  getArray(): (0 | 1)[][] {
    const a: (0 | 1)[][] = [];
    this.forEach((i, j, alive) => {
      a[i] ??= [];
      a[i][j] = alive;
    });
    return a;
  }

  forEach(fn: (i: number, j: number, alive: 0 | 1) => void) {
    const width = this.width32;
    const height = this.height;
    const array = this.uint32array;
    const BITS = 32;
    const BITS_MINUS_1 = BITS - 1;
    for (let i = 0; i < height; i++) {
      const rowIndex = i * width;
      for (let j = 0; j < width; j++) {
        const offset = rowIndex + j;
        const value = array[offset]!;
        const BITS_J = j * BITS;
        for (let u = 0; u < BITS; u++) {
          const alive = (value & (1 << (BITS_MINUS_1 - u))) !== 0 ? 1 : 0;
          fn(i, BITS_J + u, alive);
        }
      }
    }
  }

  forEachAlive(fn: (i: number, j: number) => void) {
    const width = this.width32;
    const height = this.height;
    const array = this.uint32array;
    const BITS = 32;
    const BITS_MINUS_1 = BITS - 1;
    for (let i = 0; i < height; i++) {
      const rowIndex = i * width;
      for (let j = 0; j < width; j++) {
        const offset = rowIndex + j;
        const value = array[offset]!;
        if (value !== 0) {
          const BITS_J = j * BITS;
          for (let u = 0; u < BITS; u++) {
            const alive = (value & (1 << (BITS_MINUS_1 - u))) !== 0;
            if (alive) {
              fn(i, BITS_J + u);
            }
          }
        }
      }
    }
  }

  /**
   * has alive cell at border
   */
  hasAliveCellAtBorder(): boolean {
    const width = this.width32;
    const height = this.height;
    const array = this.uint32array;

    // right and left
    for (let i = 0; i < height; i++) {
      const left = array[getOffset(width, i, 0)]!;
      const right = array[getOffset(width, i, width - 1)]!;
      if (left >>> 31 === 1) {
        return true;
      }
      if (right & 1) {
        return true;
      }
    }

    // top and bottom
    for (let j = 0; j < width; j++) {
      const top = array[getOffset(width, 0, j)];
      if (top !== 0) {
        return true;
      }
      const bottom = array[getOffset(width, height - 1, j)];
      if (bottom !== 0) {
        return true;
      }
    }

    return false;
  }

  getPopulation(): number {
    return bitCountArrayBuffer(this.uint32array.buffer);
  }

  getBoundingBox(): Rect {
    let maxX = 0;
    let minX = 0;
    let maxY = 0;
    let minY = 0;
    const width = this.width32;
    const height = this.height;
    const array = this.uint32array;
    const BITS = 32;
    const BITS_MINUS_1 = BITS - 1;
    let firstRowFound = false;
    let minXFound = false;
    for (let i = 0; i < height; i++) {
      const rowIndex = i * width;
      for (let j = 0; j < width; j++) {
        const offset = rowIndex + j;
        const value = array[offset]!;
        if (value !== 0) {
          if (!firstRowFound) {
            minY = i;
            firstRowFound = true;
          }

          maxY = i;
        }

        for (let u = 0; u < BITS; u++) {
          const alive = (value & (1 << (BITS_MINUS_1 - u))) !== 0 ? 1 : 0;
          if (alive) {
            const x = j * 32 + u;
            if (minXFound) {
              minX = Math.min(minX, x);
            } else {
              // 初回はそのまま記録
              minXFound = true;
              minX = x;
            }

            maxX = Math.max(maxX, x);
          }
        }
      }
    }

    return {
      maxX,
      minX,
      maxY,
      minY,
    };
  }

  private assertSameSize(name: string, otherBitGrid: BitGrid) {
    if (
      this.getWidth32() !== otherBitGrid.getWidth32() ||
      this.getHeight() !== otherBitGrid.getHeight()
    ) {
      throw TypeError(name + ": different grid size");
    }
  }

  /**
   * @throws not same size
   */
  equal(otherBitGrid: BitGrid): boolean {
    this.assertSameSize("BitGrid.equal", otherBitGrid);
    return equalUint32(
      this.asInternalUint32Array(),
      otherBitGrid.asInternalUint32Array(),
    );
  }

  /**
   * @throws not same size
   */
  bitOr(other: BitGrid) {
    this.assertSameSize("BitGrid.bitOr", other);
    bitOrUint32Array(
      this.asInternalUint32Array(),
      other.asInternalUint32Array(),
    );
  }

  /**
   * @throws not same size
   */
  bitAnd(other: BitGrid) {
    this.assertSameSize("BitGrid.bitAnd", other);
    bitAndUint32Array(
      this.asInternalUint32Array(),
      other.asInternalUint32Array(),
    );
  }
}

function equalUint32(a: Uint32Array, b: Uint32Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const len = a.length;

  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
