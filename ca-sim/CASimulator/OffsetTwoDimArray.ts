import type { Position } from "../type.ts";

export class OffsetTwoDimArray<
  T extends string | boolean | number | bigint | null | undefined,
> {
  /** offset */
  private dx: number = 0;
  private dy: number = 0;
  private width: number = 0;
  private height: number = 0;
  private array: T[][] = [];

  constructor(private config: { defaultValue: T }) {}

  map<S extends string | boolean | number | bigint | null | undefined>(
    fn: (value: T) => S,
    defaultValueS: S,
  ): OffsetTwoDimArray<S> {
    const offsetArray = new OffsetTwoDimArray({ defaultValue: defaultValueS });
    offsetArray.array = this.array.map((row) => row.map((a) => fn(a)));
    offsetArray.dx = this.dx;
    offsetArray.dy = this.dy;
    offsetArray.width = this.width;
    offsetArray.height = this.height;
    return offsetArray;
  }

  clone(): OffsetTwoDimArray<T> {
    return this.map((c) => c, this.config.defaultValue);
  }

  reserveX(x: number) {
    const minX = this.dx;
    if (x < minX) {
      this.prependColumns(minX - x);
      return;
    }
    const maxX = this.dx + this.width - 1;
    if (x > maxX) {
      this.appendColumns(x - maxX);
    }
  }

  reserveY(y: number) {
    const minY = this.dy;
    if (y < minY) {
      this.prependRows(minY - y);
      return;
    }
    const maxY = this.dy + this.height - 1;
    if (y > maxY) {
      this.appendRows(y - maxY);
    }
  }

  private appendRows(n: number) {
    const defaultValue = this.config.defaultValue;
    for (let k = 0; k < n; k++) {
      this.array.push(Array(this.width).fill(0).map((_) => defaultValue));
    }
    this.height += n;
  }

  private appendColumns(n: number) {
    const defaultValue = this.config.defaultValue;
    for (const row of this.array) {
      for (let k = 0; k < n; k++) {
        row.push(defaultValue);
      }
    }
    this.width += n;
  }

  private prependRows(n: number) {
    const defaultValue = this.config.defaultValue;
    for (let k = 0; k < n; k++) {
      this.array.unshift(Array(this.width).fill(0).map((_) => defaultValue));
    }
    this.height += n;
    this.dy -= n;
  }

  private prependColumns(n: number) {
    const defaultValue = this.config.defaultValue;
    for (const row of this.array) {
      for (let k = 0; k < n; k++) {
        row.unshift(defaultValue);
      }
    }
    this.dx -= n;
    this.width += n;
  }

  getInternal() {
    return {
      dx: this.dx,
      dy: this.dy,
      width: this.width,
      height: this.height,
      array: this.array,
    };
  }

  forEach(
    rect: { dx: number; dy: number; width: number; height: number },
    fn: (value: T, position: Position) => void,
  ) {
    const { dx, dy, width, height } = rect;
    for (let i = dy; i < dy + height; i++) {
      for (let j = dx; j < dx + width; j++) {
        const pos = { x: j, y: i };
        const value = this.getCell(pos);
        fn(value, pos);
      }
    }
  }

  private toArrayIndex(
    position: Position,
  ): { xIdx: number; yIdx: number } {
    return {
      xIdx: position.x - this.dx,
      yIdx: position.y - this.dy,
    };
  }

  unsafeSetCell(x: number, y: number, value: T): void {
    const xIdx = x - this.dx;
    const yIdx = y - this.dy;
    const row = this.array[yIdx];
    if (row == undefined) {
      throw new Error("internal error");
    }
    row[xIdx] = value;
  }

  setCell({ x, y }: Position, value: T): void {
    this.reserveX(x);
    this.reserveY(y);
    this.unsafeSetCell(x, y, value);
  }

  getCell(position: { x: number; y: number }): T {
    const { xIdx, yIdx } = this.toArrayIndex(position);
    const row = this.array[yIdx];
    if (row === undefined) {
      return this.config.defaultValue;
    }
    return row[xIdx] ?? this.config.defaultValue;
  }

  /**
   * @internal
   */
  __getCell(x: number, y: number): T {
    const xIdx = x - this.dx;
    const yIdx = y - this.dy;
    const row = this.array[yIdx];
    if (row === undefined) {
      return this.config.defaultValue;
    }
    return row[xIdx] ?? this.config.defaultValue;
  }

  getRect(): { dx: number; dy: number; width: number; height: number } {
    return {
      dx: this.dx,
      dy: this.dy,
      width: this.width,
      height: this.height,
    };
  }

  getMinMaxIndex():
    | { minX: number; minY: number; maxX: number; maxY: number }
    | null {
    if (this.width === 0 || this.height === 0) {
      return null;
    }

    return {
      minX: this.dx,
      minY: this.dy,
      maxX: this.dx + this.width - 1,
      maxY: this.dy + this.height - 1,
    };
  }
}
