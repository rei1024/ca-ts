import { edgeExpand } from "./CASimulator/edgeExpand.ts";
import { OffsetTwoDimArray } from "./CASimulator/OffsetTwoDimArray.ts";

export type Condition = {
  center: number;
  ne: number;
  n: number;
  nw: number;
  e: number;
  w: number;
  se: number;
  s: number;
  sw: number;
};

// Torus is not supported

/**
 * Infinite universe
 */
export class CASimulator {
  private readonly transitionRule: (condition: Condition) => number;
  readonly offsetArray = new OffsetTwoDimArray<number>({
    defaultValue: 0,
  });

  constructor(
    config: { transitionRule: (condition: Condition) => number },
  ) {
    this.transitionRule = config.transitionRule;
    if (
      this.transitionRule({
        center: 0,
        ne: 0,
        n: 0,
        nw: 0,
        e: 0,
        w: 0,
        se: 0,
        s: 0,
        sw: 0,
      }) !== 0
    ) {
      throw new Error("rules containing B0 is not supported");
    }
  }

  next(): void {
    const offsetArray = this.offsetArray;

    edgeExpand(offsetArray, 0);
    const transitionRule = this.transitionRule;
    const current = offsetArray.clone();
    offsetArray.forEach(offsetArray.getRect(), (state, p) => {
      const { x, y } = p;
      const next = transitionRule({
        center: state,
        n: current.__getCell(x, y - 1),
        ne: current.__getCell(x + 1, y - 1),
        nw: current.__getCell(x - 1, y - 1),
        e: current.__getCell(x + 1, y),
        w: current.__getCell(x - 1, y),
        se: current.__getCell(x + 1, y + 1),
        s: current.__getCell(x, y + 1),
        sw: current.__getCell(x - 1, y + 1),
      });
      offsetArray.unsafeSetCell(x, y, next);
    });
  }

  nextN(n: number): void {
    for (let i = 0; i < n; i++) {
      this.next();
    }
  }

  getPopulation(): number {
    let count = 0;
    this.offsetArray.forEach(this.offsetArray.getRect(), (v) => {
      if (v !== 0) {
        count++;
      }
    });
    return count;
  }
}

export interface Rect {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function rectToSize({ minX, minY, maxX, maxY }: Rect) {
  return {
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export function rectToArea(rect: Rect): number {
  const { width, height } = rectToSize(rect);
  return width * height;
}
