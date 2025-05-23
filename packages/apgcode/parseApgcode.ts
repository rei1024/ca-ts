import type { Apgcode } from "./Apgcode.ts";
import { charToNum, charToNumForY } from "./internal/charToNum.ts";

/**
 * Thrown by {@link parseApgcode}
 */
export class ApgcodeParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApgcodeParseError";
  }
}

/**
 * Parse {@link Apgcode}.
 *
 * ```ts
 * import { parseApgcode } from "@ca-ts/apgcode";
 *
 * const parsedCode = parseApgcode("xq4_27deee6");
 * ```
 *
 * @param identifier Example: `xq4_27deee6`
 * @throws
 */
export function parseApgcode(identifier: string): Apgcode {
  if (!/^[0-9a-zA-Z_]*$/.test(identifier)) {
    throw new ApgcodeParseError("invalid character");
  }

  if (identifier.startsWith("xs")) {
    identifier = identifier.slice("xs".length);
    const [pop] = identifier.split("_", 1);

    if (pop === undefined || pop.length === 0 || !/^[0-9+]$/.test(pop)) {
      throw new ApgcodeParseError("Parse error");
    }

    const rest = identifier.slice(pop.length + 1); // +1 for _
    const pattern = parseExtendedWechslerFormat(rest);

    return {
      type: "still-life",
      population: Number(pop),
      cells: pattern,
    };
  } else if (identifier.startsWith("xp") || identifier.startsWith("xq")) {
    identifier = identifier.slice("xp".length);
    const [period] = identifier.split("_", 1);

    if (
      period === undefined || period.length === 0 || !/^[0-9+]$/.test(period)
    ) {
      throw new ApgcodeParseError("Parse error");
    }

    const rest = identifier.slice(period.length + 1); // +1 for _
    const pattern = parseExtendedWechslerFormat(rest);

    return {
      type: identifier.startsWith("xp") ? "oscillator" : "spaceship",
      period: Number(period),
      cells: pattern,
    };
  } else if (identifier.startsWith("yl")) {
    identifier = identifier.slice("yl".length);
    const array = identifier.split("_");
    if (array.length !== 4) {
      throw new ApgcodeParseError("Parse Error");
    }
    return {
      type: "linear",

      populationGrowthPeriod: Number(array[0]),
      debrisPeriod: Number(array[1]),
      populationGrowthAmount: Number(array[2]),
      hash: array[3] ?? (() => {
        throw new ApgcodeParseError("Parse Error");
      })(),
    };
  } else if (identifier.startsWith("methuselah")) {
    throw new ApgcodeParseError("unsupported");
  } else if (identifier.startsWith("messless")) {
    throw new ApgcodeParseError("unsupported");
  } else if (identifier.startsWith("megasized")) {
    throw new ApgcodeParseError("unsupported");
  } else if (identifier.startsWith("ov")) {
    throw new ApgcodeParseError("unsupported");
  } else if (identifier.startsWith("zz") || identifier === "PATHOLOGICAL") {
    throw new ApgcodeParseError("unsupported");
  }

  throw new ApgcodeParseError("Parse error");
}

/**
 * Parse [Extended Wechsler format](https://conwaylife.com/wiki/Apgcode#Extended_Wechsler_format)
 *
 * ```ts
 * import { parseExtendedWechslerFormat } from "@ca-ts/apgcode";
 *
 * const cells = parseExtendedWechslerFormat("27deee6");
 * ```
 *
 * @param source Example: `27deee6`
 * @returns List of living cells
 * @throws
 */
export function parseExtendedWechslerFormat(
  source: string,
): { x: number; y: number }[] {
  if (!/^[0-9a-z]*$/.test(source)) {
    throw new ApgcodeParseError(
      "invalid character for Extended Wechsler format",
    );
  }

  let x = 0;
  let y = 0;
  const chars = [...source];
  let row: { x: number; y: number }[][] = [[], [], [], [], []];
  let cells: { x: number; y: number }[] = [];

  function push() {
    cells = cells.concat(row.flat());
    row = [[], [], [], [], []];
  }

  for (let charIndex = 0; charIndex < chars.length; charIndex++) {
    const char = chars[charIndex];
    if (char === undefined) {
      throw new Error("Internal error");
    }
    const num = charToNum(char);
    if (num == null) {
      if (char === "w") {
        x += 2;
      } else if (char === "x") {
        x += 3;
      } else if (char === "y") {
        charIndex++;
        const nextChar = chars[charIndex];
        if (nextChar === undefined) {
          throw new ApgcodeParseError("Parse error");
        }
        const zeroNum = charToNumForY(nextChar);
        if (zeroNum === null) {
          throw new ApgcodeParseError("Parse error");
        }
        x += zeroNum;
      } else if (char === "z") {
        push();
        x = 0;
        y += 5;
      }
    } else {
      for (let i = 0; i < 5; i++) {
        if ((num & (1 << i)) !== 0) {
          row[i]!.push({
            x,
            y: y + i,
          });
        }
      }
      x++;
    }
  }

  push();
  return cells;
}
