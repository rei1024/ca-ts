import { intConditionArray } from "../internal/intConditionArray.ts";

function mod(i: number, j: number) {
  const k = i % j;
  return k < 0 ? (k + (j < 0 ? -j : j)) : k;
}

/**
 * Isotropic non-totalistic
 */
export class IntWorld {
  private width: number;
  private height: number;
  private array: Uint8Array;
  private tempArray: Uint8Array;
  private updateCell: (
    prevCenter: 0 | 1,
    a: 0 | 1,
    b: 0 | 1,
    c: 0 | 1,
    d: 0 | 1,
    e: 0 | 1,
    f: 0 | 1,
    g: 0 | 1,
    h: 0 | 1,
  ) => 0 | 1;
  /**
   * @param width width of the world
   * @param height height of the world
   * @param transition `{ birth: ["3k"], survive: ["4i"] }`
   */
  constructor(
    width: number,
    height: number,
    private transition: { birth: string[]; survive: string[] },
    array?: Uint8Array,
  ) {
    if (typeof width !== "number") {
      throw TypeError("width is not a number");
    }

    this.width = width;
    this.height = height;
    const len = width * height;

    this.array = array ?? new Uint8Array(len);
    this.tempArray = new Uint8Array(len);

    const birth = transition.birth;
    const birth0 = birth.includes("0") ? 0xffffffff : 0;

    if (birth0 !== 0) {
      throw new Error("B0 rule");
    }

    const lookupTableBirth = Array(256).fill(0).map((_, i) =>
      birth.includes(intConditionArray[i] ?? "") ? 1 : 0
    );

    const lookupTableSurvive = Array(256).fill(0).map((_, i) =>
      transition.survive.includes(intConditionArray[i] ?? "") ? 1 : 0
    );

    this.updateCell = (
      prevCenter,
      a,
      b,
      c,
      d,
      e,
      f,
      g,
      h,
    ) => {
      return (prevCenter ? lookupTableSurvive : lookupTableBirth)[
        a + b * 2 + c * 4 + d * 8 + e * 16 + f * 32 + g * 64 + h * 128
      ]!;
    };
  }

  clone() {
    const intWorld = new IntWorld(
      this.width,
      this.height,
      this.transition,
      this.array.slice(),
    );
    return intWorld;
  }

  asInternalUint8Array() {
    return this.array;
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

  /**
   * Get cell at (x, y)
   */
  get(x: number, y: number): 0 | 1 {
    return this.array[y * this.width + x] as 0 | 1;
  }

  random({ liveRatio }: { liveRatio?: number } = {}) {
    const array = this.array;
    liveRatio = liveRatio ?? 0.5;
    array.forEach((_, i) => {
      array[i] = Math.random() < liveRatio ? 0 : 1;
    });
  }

  getArray(): (0 | 1)[][] {
    const a: (0 | 1)[][] = [];
    this.forEach((x, y, alive) => {
      a[y] ??= [];
      a[y][x] = alive;
    });
    return a;
  }

  forEach(fn: (x: number, y: number, alive: 0 | 1) => void) {
    const width = this.width;
    const height = this.height;
    const array = this.array;
    for (let i = 0; i < height; i++) {
      const middle = i * width;
      for (let j = 0; j < width; j++) {
        fn(j, i, array[middle + j] as 0 | 1);
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

  equal(otherWorld: IntWorld): boolean {
    if (
      this.width !== otherWorld.width || this.height !== otherWorld.height ||
      this.array.length !== otherWorld.array.length
    ) {
      return false;
    }
    const array = this.array;
    const otherArray = otherWorld.array;
    const len = this.array.length;
    for (let i = 0; i < len; i++) {
      if (array[i] !== otherArray[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 次の世代に更新する
   */
  next() {
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
        tempArray[middleOffset] = this.updateCell(
          array[middleOffset]! as 0 | 1,
          array[up + left]! as 0 | 1,
          array[up + j]! as 0 | 1,
          array[up + right]! as 0 | 1,
          array[middle + left]! as 0 | 1,
          array[middle + right]! as 0 | 1,
          array[down + left]! as 0 | 1,
          array[down + j]! as 0 | 1,
          array[down + right]! as 0 | 1,
        );
      }
    }

    array.set(tempArray);
  }

  hasAliveCellAtBorder(): boolean {
    const getOffset = (width: number, iHeight: number, jWidth: number) => {
      return iHeight * width + jWidth;
    };

    const array = this.array;
    const width = this.width;
    const height = this.height;
    // right and left
    for (let i = 0; i < height; i++) {
      const left = array[getOffset(width, i, 0)]!;
      if (left !== 0) {
        return true;
      }
      const right = array[getOffset(width, i, width - 1)]!;
      if (right !== 0) {
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
}
