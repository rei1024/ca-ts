import {
  bitAndUint32Array,
  bitCountArrayBuffer,
  bitOrUint32Array,
} from "./internal/bitwise.ts";
import { equalUint32Array } from "./internal/util.ts";

const getOffset = (width32: number, iHeight: number, jWidth: number) => {
  return iHeight * width32 + jWidth;
};

/**
 * 2D bit array
 */
export class BitGrid {
  /**
   * Precondition: `width32 * height = uint32array.length`
   */
  constructor(
    private readonly width32: number,
    private readonly height: number,
    private readonly uint32array: Uint32Array,
  ) {
    if (width32 * height !== uint32array.length) {
      throw new Error("Error");
    }
  }

  static make({ width, height }: { width: number; height: number }): BitGrid {
    const width32 = Math.ceil(width / 32);
    const len = width32 * height;
    return new BitGrid(width32, height, new Uint32Array(len));
  }

  /**
   * Creates a deep copy of the BitGrid.
   */
  clone(): BitGrid {
    return new BitGrid(this.width32, this.height, this.uint32array.slice());
  }

  /**
   * Fills the grid with random bit values
   */
  random() {
    const array = this.uint32array;
    if (crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      const len = array.length;
      for (let i = 0; i < len; i++) {
        array[i] = Math.floor(Math.random() * Math.pow(2, 32));
      }
    }
  }

  /**
   * Clears all bits in the grid, setting all cell values to 0.
   */
  clear() {
    this.uint32array.fill(0);
  }

  /**
   * Returns the internal Uint32Array representing the grid data.
   */
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
   * Sets the cell at the specified coordinates (x, y) to "alive" (1).
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
   * Gets the state of the cell at the specified coordinates (x, y).
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

  /**
   * Returns the entire grid as a 2D array of 0s and 1s.
   */
  getArray(): (0 | 1)[][] {
    const array: (0 | 1)[][] = Array(this.getHeight())
      .fill(0)
      .map(() =>
        Array(this.getWidth())
          .fill(0)
          .map(() => 0)
      );

    this.forEachAlive((x, y) => {
      array[y]![x] = 1;
    });

    return array;
  }

  /**
   * Iterates over all cells in the grid, calling the provided function for each cell.
   */
  forEach(fn: (x: number, y: number, alive: 0 | 1) => void) {
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
        let bitMask = 1 << BITS_MINUS_1;
        for (let u = 0; u < BITS; u++) {
          fn(BITS_J + u, i, ((value & bitMask) !== 0) ? 1 : 0);
          bitMask >>>= 1;
        }
      }
    }
  }

  /**
   * Iterates over only the "alive" cells in the grid, calling the provided function
   * for each alive cell.  This is more efficient than `forEach` if the grid is sparse.
   */
  forEachAlive(fn: (x: number, y: number) => void) {
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
          let bitMask = 1 << BITS_MINUS_1;
          const BITS_J = j * BITS;
          for (let u = 0; u < BITS; u++) {
            if ((value & bitMask) !== 0) {
              fn(BITS_J + u, i);
            }
            bitMask >>>= 1;
          }
        }
      }
    }
  }

  /**
   * Checks if there are any live cells at the each border of the grid.
   */
  borderAlive(): {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  } {
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;

    const width = this.width32;
    const height = this.height;
    const array = this.uint32array;

    // right and left
    for (let i = 0; i < height; i++) {
      const leftCell = array[getOffset(width, i, 0)]!;
      const rightCell = array[getOffset(width, i, width - 1)]!;
      if (leftCell >>> 31 === 1) {
        left = true;
      }
      if (rightCell & 1) {
        right = true;
      }
    }

    // top and bottom
    for (let j = 0; j < width; j++) {
      const topCell = array[getOffset(width, 0, j)];
      if (topCell !== 0) {
        top = true;
      }
      const bottomCell = array[getOffset(width, height - 1, j)];
      if (bottomCell !== 0) {
        bottom = true;
      }
    }

    return {
      left,
      right,
      top,
      bottom,
    };
  }

  /**
   * Checks if there are any live cells at the border of the grid.
   */
  hasAliveCellAtBorder(): boolean {
    const width = this.width32;
    const height = this.height;
    const array = this.uint32array;

    // right and left
    for (let i = 0; i < height; i++) {
      const leftCell = array[getOffset(width, i, 0)]!;
      const rightCell = array[getOffset(width, i, width - 1)]!;
      if (leftCell >>> 31 === 1) {
        return true;
      }
      if (rightCell & 1) {
        return true;
      }
    }

    // top and bottom
    for (let j = 0; j < width; j++) {
      const topCell = array[getOffset(width, 0, j)];
      if (topCell !== 0) {
        return true;
      }
      const bottomCell = array[getOffset(width, height - 1, j)];
      if (bottomCell !== 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets the population (number of live cells) in the grid.
   */
  getPopulation(): number {
    return bitCountArrayBuffer(this.uint32array.buffer);
  }

  /**
   * Gets the bounding box of the live cells in the grid.
   */
  getBoundingBox(): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
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
        if (value === 0) {
          continue; // skip empty cells
        }

        if (!firstRowFound) {
          minY = i;
          firstRowFound = true;
        }

        maxY = i;

        for (let u = 0; u < BITS; u++) {
          const alive = (value & (1 << (BITS_MINUS_1 - u))) !== 0;
          if (alive) {
            const x = j * 32 + u;
            if (minXFound) {
              minX = Math.min(minX, x);
            } else {
              // first found
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
   * Checks if this BitGrid is equal to another BitGrid.  Two BitGrids are considered
   * equal if they have the same dimensions and the same cell values.
   *
   * @throws {TypeError} If the dimensions of the two BitGrids are different.
   */
  equal(otherBitGrid: BitGrid): boolean {
    this.assertSameSize("BitGrid.equal", otherBitGrid);
    return equalUint32Array(
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

  expanded(
    { expand, offset }: {
      expand: { x: number; y: number };
      offset?: { x?: number; y?: number };
    },
  ): BitGrid {
    if (expand.x < 0 || expand.y < 0) {
      throw new RangeError("expandX and expandY must be non-negative");
    }

    const offsetX = offset?.x ?? 0;
    const offsetY = offset?.y ?? 0;

    if (offsetX % 32 !== 0) {
      throw new RangeError("offsetX must be a multiple of 32");
    }

    const newWidth = this.getWidth() + expand.x;
    const newHeight = this.getHeight() + expand.y;
    const newGrid = BitGrid.make({ width: newWidth, height: newHeight });
    const array = this.asInternalUint32Array();
    const newArray = newGrid.asInternalUint32Array();

    const newWidth32 = newGrid.getWidth32();
    const currentWidth32 = this.getWidth32();
    const currentHeight = this.height;

    for (let i = 0; i < currentHeight; i++) {
      for (let j = 0; j < currentWidth32; j++) {
        const oldOffset = getOffset(currentWidth32, i, j);
        const newOffset = getOffset(newWidth32, i + offsetY, j + offsetX);
        newArray[newOffset] = array[oldOffset]!;
      }
    }

    return newGrid;
  }
}
