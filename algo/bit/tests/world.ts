function mod(i: number, j: number) {
  const k = i % j;
  return k < 0 ? (k + (j < 0 ? -j : j)) : k;
}

/**
 * Rule of Conway's Game of Life
 * @param cell state of center cell
 * @param count number of neighbour live cell
 * @returns next state of center cell
 */
const updateCell = (cell: 0 | 1, count: number): 0 | 1 => {
  if (cell === 0 && count === 3) {
    return 1;
  } else if (cell === 1 && (count === 2 || count === 3)) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Game of Life
 */
export class World {
  private width: number;
  private height: number;
  private array: Uint8Array;
  private tempArray: Uint8Array;
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
        const count = array[up + left]! +
          array[up + j]! +
          array[up + right]! +
          array[middle + left]! +
          array[middle + right]! +
          array[down + left]! +
          array[down + j]! +
          array[down + right]!;
        const middleOffset = middle + j;
        tempArray[middleOffset] = updateCell(
          array[middleOffset]! as 0 | 1,
          count,
        );
      }
    }

    array.set(tempArray);
  }
}
