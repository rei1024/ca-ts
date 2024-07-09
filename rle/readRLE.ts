import type { RLE } from "./RLE.ts";

import { type IRLEVistor, visitRLE } from "./readRLE/visitRLE.ts";

export class RLEVistor implements IRLEVistor {
  public cells: { x: number; y: number; state: number }[] = [];
  /** include # */
  public comments: string[] = [];
  /** include # */
  public trailingComment: string = "";
  /** rule = ... */
  public ruleString = "";
  /** x = ... */
  public width = 0;
  /** y = ... */
  public height = 0;
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
      throw Error("Parse error");
    }
    this.width = x;
    this.height = y;
  }

  visitRule(ruleString: string): void {
    this.ruleString = ruleString;
  }

  visitCell(x: number, y: number, state: number): void {
    this.cells.push({ x, y, state });
  }
}

/**
 * Parse {@link RLE} file.
 * @throws
 */
export function readRLE(source: string): RLE {
  const visitor = new RLEVistor();
  visitRLE(visitor, source);

  return {
    cells: visitor.cells,
    comments: visitor.comments,
    trailingComment: visitor.trailingComment,
    ruleString: visitor.ruleString,
    size: {
      width: visitor.width,
      height: visitor.height,
    },
    XRLE: visitor.XRLE,
  };
}
