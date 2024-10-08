import type { CACell, RLE } from "./RLE.ts";
import { RLEParseError } from "./parseRLE/RLEParseError.ts";

import { type IRLEVisitor, visitRLE } from "./parseRLE/visitRLE.ts";

export class RLEVisitor implements IRLEVisitor {
  public cells: CACell[] = [];
  /** include # */
  public comments: string[] = [];
  /** include # */
  public trailingComment: string = "";
  /** rule = ... */
  public ruleString = "";
  /** x = ..., y = ... */
  public size: { width: number; height: number } | null = null;
  public XRLE:
    | { position: { x: number; y: number } | null; generation: string | null }
    | null = null;

  constructor() {}

  visitXRLE(gen: string | null, pos: { x: number; y: number } | null): void {
    if (this.XRLE == null) {
      this.XRLE = { generation: null, position: null };
    }
    this.XRLE.generation = gen;
    this.XRLE.position = pos;
  }

  visitComment(commentLine: string): void {
    this.comments.push(commentLine);
  }

  visitTrailingComment(comment: string): void {
    this.trailingComment += comment;
  }

  visitSize({ x, y }: { x: number; y: number }): void {
    if (isNaN(x) || isNaN(y)) {
      throw new RLEParseError("Parse error");
    }
    this.size = { width: x, height: y };
  }

  visitRule(ruleString: string): void {
    this.ruleString = ruleString;
  }

  visitCell(x: number, y: number, state: number): void {
    this.cells.push({ position: { x, y }, state });
  }
}

/**
 * Parse {@link RLE} file.
 *
 * @example
 * ```ts
 * import { parseRLE, type RLE } from "@ca-ts/rle"
 *
 * const rle: RLE = parseRLE(`#N Glider
 * x = 3, y = 3, rule = B3/S23
 * bob$2bo$3o!`);
 * ```
 * @throws
 */
export function parseRLE(source: string): RLE {
  const visitor = new RLEVisitor();
  visitRLE(visitor, source);

  return {
    cells: visitor.cells,
    comments: visitor.comments,
    trailingComment: visitor.trailingComment,
    ruleString: visitor.ruleString,
    size: visitor.size,
    XRLE: visitor.XRLE,
  };
}
