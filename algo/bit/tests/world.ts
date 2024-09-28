function mod(i: number, j: number) {
  const k = i % j;
  return k < 0 ? (k + (j < 0 ? -j : j)) : k;
}

/**
 * ライフゲームのルール
 * @param cell 自身の状態（0が死で1が生）
 * @param count 近傍セルの生個数
 * @returns
 */
const updateCell = (cell: number, count: number): number => {
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
   * @param {number} width
   * @param {number} height
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

  clear() {
    this.array.fill(0);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  set(x: number, y: number) {
    this.array[y * this.width + x] = 1;
  }

  random() {
    const array = this.array;
    array.forEach((_, i) => {
      array[i] = Math.random() < 0.6 ? 0 : 1;
    });
  }

  getArray() {
    const a: boolean[][] = [];
    this.forEach((i, j, alive) => {
      a[i] ??= [];
      a[i][j] = alive;
    });
    return a;
  }

  forEach(fn: (i: number, j: number, alive: boolean) => void) {
    const width = this.width;
    const height = this.height;
    const array = this.array;
    for (let i = 0; i < height; i++) {
      const middle = i * width;
      for (let j = 0; j < width; j++) {
        fn(i, j, array[middle + j] ? true : false);
      }
    }
  }

  forEachAlive(fn: (i: number, j: number) => void) {
    this.forEach((i, j, alive) => {
      if (alive) {
        fn(i, j);
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
          array[middleOffset]!,
          count,
        );
      }
    }

    array.set(tempArray);
  }
}