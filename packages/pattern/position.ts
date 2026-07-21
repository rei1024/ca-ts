import type { Position } from "./types.ts";

export class Pos {
  static readonly ZERO: Position = { x: 0, y: 0 };

  /** Adds vector `b` from vector `a` (`a + b`). */
  static add(a: Position, b: Position): Position {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  /** Subtracts vector `b` from vector `a` (`a - b`). */
  static sub(a: Position, b: Position): Position {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  /** Scales a position vector by a scalar factor `s`. */
  static scale(pos: Position, s: number): Position {
    return { x: pos.x * s, y: pos.y * s };
  }

  /** Scales a position relative to a reference point/pivot `origin`. */
  static scaleFrom(pos: Position, origin: Position, factor: number): Position {
    return {
      x: origin.x + (pos.x - origin.x) * factor,
      y: origin.y + (pos.y - origin.y) * factor,
    };
  }

  /** Reflects a position across an origin point. */
  static reflect(pos: Position, origin: Position = Pos.ZERO): Position {
    return {
      x: 2 * origin.x - pos.x,
      y: 2 * origin.y - pos.y,
    };
  }

  /**
   * Reflects a position horizontally across an X-axis line.
   * Accepts an exact coordinate (`number`) or a boundary between two coordinates (`{ between: { x0, x1 } }`).
   */
  static reflectHorizontal(
    pos: Position,
    axisX: number | { between: { x0: number; x1: number } },
  ): Position {
    const doubleX = typeof axisX === "number"
      ? axisX * 2
      : (axisX.between.x0 + axisX.between.x1);

    return { x: doubleX - pos.x, y: pos.y };
  }

  /**
   * Reflects a position vertically across a Y-axis line.
   * Accepts an exact coordinate (`number`) or a boundary between two coordinates (`{ between: { y0, y1 } }`).
   */
  static reflectVertical(
    pos: Position,
    axisY: number | { between: { y0: number; y1: number } },
  ): Position {
    const doubleY = typeof axisY === "number"
      ? axisY * 2
      : (axisY.between.y0 + axisY.between.y1);

    return { x: pos.x, y: doubleY - pos.y };
  }

  /** Calculates the dot product of two position vectors (`a · b`). */
  static dotProd(a: Position, b: Position): number {
    return a.x * b.x + a.y * b.y;
  }

  /** Converts to an array */
  static toArray(a: Position): [x: number, y: number] {
    return [a.x, a.y];
  }

  /** Converts from an array */
  static fromArray(array: [x: number, y: number]): Position {
    if (array.length != 2) {
      throw new Error("array length is not 2. Got " + array.length);
    }
    return { x: array[0], y: array[1] };
  }
}
