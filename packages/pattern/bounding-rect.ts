import type { CACell } from "./types.ts";

/**
 * Bounding rectangle.
 */
export class BoundingRect {
  /**
   * @param minX minimum x coordinate
   * @param minY minimum y coordinate
   * @param maxX maximum x coordinate
   * @param maxY maximum y coordinate
   */
  private constructor(
    public readonly minX: number,
    public readonly minY: number,
    public readonly maxX: number,
    public readonly maxY: number,
  ) {}

  /**
   * Width of the bounding rectangle
   */
  get width(): number {
    return this.maxX - this.minX + 1;
  }

  /**
   * Height of the bounding rectangle
   */
  get height(): number {
    return this.maxY - this.minY + 1;
  }

  /**
   * Get width and height.
   */
  get size(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Get area.
   */
  get area(): number {
    return this.width * this.height;
  }

  /**
   * Return union on cells.
   */
  union(other: BoundingRect): BoundingRect {
    return new BoundingRect(
      Math.min(this.minX, other.minX),
      Math.min(this.minY, other.minY),
      Math.max(this.maxX, other.maxX),
      Math.max(this.maxY, other.maxY),
    );
  }
}

export function rectFromCells(cells: readonly CACell[]): BoundingRect | null {
  if (cells.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const cell of cells) {
    const x = cell.position.x;
    const y = cell.position.y;

    if (x < minX) {
      minX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
  }

  // @ts-ignore private
  return new BoundingRect(minX, minY, maxX, maxY);
}
