import { RLEParseError } from "./RLEParseError.ts";
import { parseXRLELine } from "./XRLE.ts";

export type IRLEVisitor = {
  /**
   * Extended RLE Format
   * "#CXRLE Pos=0,-1377 Gen=34801"
   * @param generation generation count. maybe greater than Number.MAX_SAFE_INTEGER
   */
  visitXRLE(
    generation: string | null,
    position: { x: number; y: number } | null,
  ): void;
  /**
   * "x = ..., y = ..."
   */
  visitSize({ x, y }: { x: number; y: number }): void;
  visitRule(ruleString: string): void;
  visitCell(x: number, y: number, state: number): void;
  /**
   * @param comment include '#'
   */
  visitComment(comment: string): void;
  /**
   * after "!"
   * maybe include "\n"
   */
  visitTrailingComment(comment: string): void;
};

const A_CODE = "A".charCodeAt(0);
const ZERO_CODE = "0".charCodeAt(0);
const LOWER_P_CODE = "p".charCodeAt(0);

class VisitState {
  private x = 0;
  private y = 0;
  private sawRule = false;
  private offsetX = 0;
  private offsetY = 0;

  constructor(
    private visitor: IRLEVisitor,
  ) {}

  read(lines: Iterable<string>) {
    const trailingCommentLines: string[] = [];
    let rleFinished = false;
    let lineNum = 0;
    for (const line of lines) {
      lineNum++;
      if (rleFinished) {
        trailingCommentLines.push(line);
      } else {
        const result = this.readLine(line, lineNum);
        if (result === "end") {
          rleFinished = true;
        }
      }
    }
    this.visitor.visitTrailingComment(
      trailingCommentLines.map((l) => "\n" + l).join(""),
    );
  }

  /**
   * @returns `"end"` for `"!"` line
   */
  private readLine(line: string, lineNum: number): "continue" | "end" {
    if (line.trimStart().startsWith("#")) {
      this.readComment(line);
      return "continue";
    } else if (
      line.startsWith("x") &&
      (line.startsWith("x ") || line.startsWith("x="))
    ) {
      this.readRule(line, lineNum);
      return "continue";
    }

    let n = 0;
    const len = line.length;
    const visitor = this.visitor;
    for (let i = 0; i < len; i++) {
      const c = line[i];
      if (c === undefined) {
        throw new Error("internal error");
      }
      if ("0" <= c && c <= "9") {
        n = n * 10 + c.charCodeAt(0) - ZERO_CODE;
      } else {
        if (n === 0) {
          n = 1;
        }
        if (c === "b" || c === ".") {
          this.x += n;
        } else if (c === "$") {
          this.x = 0;
          this.y += n;
        } else if (c === "!") {
          visitor.visitTrailingComment(line.slice(i + 1));
          return "end";
        } else if (
          ("o" <= c && c <= "y") || ("A" <= c && c <= "X")
        ) {
          let state = -1;
          if (c === "o") {
            state = 1;
          } else if (c < "o") {
            state = c.charCodeAt(0) - A_CODE + 1;
          } else {
            state = 24 * (c.charCodeAt(0) - LOWER_P_CODE + 1);
            i++;
            const c2 = line[i];
            if (c2 !== undefined && "A" <= c2 && c2 <= "X") {
              state = state + c2.charCodeAt(0) - A_CODE + 1;
            } else {
              // allow Niemiec cells ('z' and 'x')
              // if (c2 === undefined) {}
              // return "Illegal multi-char state"
              state = 1;
              i--;
            }
          }
          const x = this.offsetX + this.x;
          const y = this.offsetY + this.y;
          if (state > 255) {
            throw new RLEParseError("invalid state", { line: lineNum });
          }
          for (let j = 0; j < n; j++) {
            visitor.visitCell(x + j, y, state);
          }
          this.x += n;
        }
        n = 0;
      }
    } /* for */
    return "continue";
  }

  private readComment(line: string) {
    const RULE_COMMENT_HEADER = "#r";
    if (line.startsWith(RULE_COMMENT_HEADER)) {
      this.sawRule = true;
      this.visitor.visitRule(
        line.slice(RULE_COMMENT_HEADER.length).trim(),
      );
    }
    const res = parseXRLELine(line);
    if (res !== undefined) {
      this.visitor.visitXRLE(res.generation, res.position);

      if (res.position) {
        this.offsetX = res.position.x;
        this.offsetY = res.position.y;
      }
    }
    this.visitor.visitComment(line);
  }

  private readRule(line: string, lineNum: number) {
    const reg = /x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)\s*(,\s*rule\s*=(.*))?/;
    const res = line.match(reg);
    if (res === null) {
      throw new RLEParseError("invalid header", { line: lineNum });
    }
    const x = res[1];
    const y = res[2];
    if (x === undefined || y === undefined) {
      throw new RLEParseError("invalid header", { line: lineNum });
    }
    this.visitor.visitSize({ x: Number(x), y: Number(y) });
    const rule = res[4];
    if (rule !== undefined) {
      this.sawRule = true;
      this.visitor.visitRule(rule.trim());
    }
    if (!this.sawRule) {
      this.visitor.visitRule("B3/S23"); // default
    }
  }
}

export function visitRLE(visitor: IRLEVisitor, source: string): void {
  const visitState = new VisitState(visitor);
  visitState.read(source.split(/\n|\r\n/g));
}
