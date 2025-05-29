const tempN = [0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * @example
 * ```ts ignore
 * import { parseRuleFormat, resolveTable } from "@ca-ts/rule-format";
 * import { parseRLE } from "@ca-ts/rle";
 *
 * const WireWorldRule: string = "<ACTUAL RULE>";
 * const transitionMap = resolveTable(parseRuleFormat(WireWorldRule).table?.lines ?? []);
 * const ruleLoaderWorld = new RuleLoaderWorld({
 *   size: { width: 48, height: 12 },
 *   rule: (values) => transitionMap.get(values),
 * });
 *
 * const rle = `x = 46, y = 9, rule = WireWorld
 * .3CA$C4.B3C$.4C4.C.C$8.38C$8.C2.C$8.38C$.4C4.C.C$B4.4C$.A3C!`;
 *
 * const cells = parseRLE(rle).cells;
 *
 * for (const cell of cells) {
 *   ruleLoaderWorld.set(cell.position.x, cell.position.y, cell.state);
 * }
 *
 * for (let i = 0; i < 100; i++) {
 *   ruleLoaderWorld.next();
 * }
 * ```
 * @module
 */

/**
 * Represents a 2D cellular automaton world that evolves according to a user-defined rule.
 */
export class RuleLoaderWorld {
  private rule: (values: number[]) => number | undefined;
  private array: Uint8Array;
  private tempArray: Uint8Array;
  private readonly size: { readonly width: number; readonly height: number };

  constructor(
    { size, rule }: {
      size: { width: number; height: number };
      rule: (values: number[]) => number | undefined;
    },
  ) {
    this.size = size;
    this.rule = rule;

    const len = size.width * size.height;
    this.array = new Uint8Array(len);
    this.tempArray = new Uint8Array(len);
  }

  getSize(): { readonly width: number; readonly height: number } {
    return this.size;
  }

  /**
   * set all cells to dead
   */
  clear(): void {
    this.array.fill(0);
  }

  /**
   * Set `state` at (x, y)
   */
  set(x: number, y: number, state: number): void {
    this.array[y * this.size.width + x] = state;
  }

  random({ liveRatio }: { liveRatio?: number } = {}): void {
    const array = this.array;
    array.forEach((_, i) => {
      array[i] = Math.random() < (liveRatio ?? 0.5) ? 0 : 1;
    });
  }

  forEach(fn: (x: number, y: number, state: number) => void) {
    const width = this.size.width;
    const height = this.size.height;
    const array = this.array;
    for (let i = 0; i < height; i++) {
      const middle = i * width;
      for (let j = 0; j < width; j++) {
        fn(j, i, array[middle + j]!);
      }
    }
  }

  /**
   * Get two dimensional array
   */
  getArray(): number[][] {
    const a: number[][] = [];
    this.forEach((x, y, state) => {
      a[y] ??= [];
      a[y][x] = state;
    });
    return a;
  }

  /**
   * Next generation
   */
  next(): void {
    const width = this.size.width;
    const height = this.size.height;
    const array = this.array;
    const tempArray = this.tempArray;
    const rule = this.rule;
    for (let i = 0; i < height; i++) {
      const up = mod(i - 1, height) * width;
      const middle = i * width;
      const down = ((i + 1) % height) * width;
      for (let j = 0; j < width; j++) {
        const left = mod(j - 1, width);
        const right = (j + 1) % width;
        /**
         * ```txt
         * ne n nw
         * e  c  w
         * se s sw
         * ```
         */
        const ne = array[up + left]!;
        const n = array[up + j]!;
        const nw = array[up + right]!;
        const e = array[middle + left]!;
        const w = array[middle + right]!;
        const se = array[down + left]!;
        const s = array[down + j]!;
        const sw = array[down + right]!;
        const middleOffset = middle + j;
        const c = array[middleOffset]!;

        // optimization
        if (
          c === 0 && n === 0 && ne === 0 && e === 0 && se === 0 && s === 0 &&
          sw === 0 && w === 0 && nw === 0
        ) {
          tempArray[middleOffset] = c;
          continue;
        }

        tempN[0] = c;
        tempN[1] = n;
        tempN[2] = ne;
        tempN[3] = e;
        tempN[4] = se;
        tempN[5] = s;
        tempN[6] = sw;
        tempN[7] = w;
        tempN[8] = nw;
        const nextCell = rule(tempN);
        tempArray[middleOffset] = nextCell ?? c;
      }
    }

    if (tempN.length !== 9) {
      throw new Error("invariant");
    }

    array.set(tempArray);
  }
}

function mod(i: number, j: number) {
  const k = i % j;
  return k < 0 ? (k + (j < 0 ? -j : j)) : k;
}
