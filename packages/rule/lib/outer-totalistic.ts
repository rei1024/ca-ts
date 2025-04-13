import {
  type GridParameter,
  parseGridParameter,
  stringifyGridParameterWithColon,
} from "./grid/mod.ts";

/**
 * Outer-totalistic CA
 *
 * B/S notation
 *
 * ### Reference
 * - [Life-like cellular automaton | LifeWiki](https://conwaylife.com/wiki/Life-like_cellular_automaton)
 */
export type OuterTotalisticRule = {
  /**
   * Rule type
   */
  type: "outer-totalistic";
  /**
   * `B3/S23` -> `{ birth: [3], survive: [2, 3] }`
   */
  transition: {
    birth: number[];
    survive: number[];
  };
  /**
   * [Generations | LifeWiki](https://conwaylife.com/wiki/Generations)
   */
  generations?: number;
  /**
   * [Bounded grids | GollyHelp](https://golly.sourceforge.io/Help/bounded.html)
   */
  gridParameter?: GridParameter;
};

/**
 * Parse {@link OuterTotalisticRule}
 *
 * @example
 * ```ts
parseOuterTotalistic("B3/S23")
// {
//   type: "outer-totalistic",
//   transition: { birth: [ 3 ], survive: [ 2, 3 ] }
// }
  ```
 */
export function parseOuterTotalistic(
  ruleString: string,
): OuterTotalisticRule {
  ruleString = ruleString.trim();

  const colonIndex = ruleString.indexOf(":");
  let gridParameter: GridParameter | null = null;
  if (colonIndex !== -1) {
    const gridParameterStr = ruleString.slice(colonIndex + 1); // +1 for ":"
    ruleString = ruleString.slice(0, colonIndex);
    gridParameter = parseGridParameter(gridParameterStr);
  }

  // B/S
  const bsRegex =
    /^(B|b)(?<birth>\d*)\/(S|s)(?<survive>\d*)(|\/(G|g|C|c)?(?<generations>\d+))$/;
  // S/B
  const sbRegex = /^(?<survive>\d*)\/(?<birth>\d*)(|\/(?<generations>\d+))$/;
  // G/B/S
  const gbsRegex =
    /^(G|g|C|c)(?<generations>\d+)\/(B|b)(?<birth>\d*)\/(S|s)(?<survive>\d*)$/;
  const match = (ruleString.match(bsRegex) ?? ruleString.match(sbRegex)) ??
    ruleString.match(gbsRegex);

  if (match) {
    const b = match.groups?.birth;
    const s = match.groups?.survive;
    const generationsString = match.groups?.generations;
    const generations = generationsString == null
      ? undefined
      : Number(generationsString);
    if (generations != null && generations < 2) {
      throw new Error("Generations should be greater than or equal to 2");
    }
    if (b !== undefined && s !== undefined) {
      return {
        type: "outer-totalistic",
        transition: bsToTransition(b, s),
        ...generations == null ? {} : {
          generations: Number(generations),
        },
        ...gridParameter == null ? {} : {
          gridParameter,
        },
      };
    }
  }

  throw new Error("Parse Error");
}

function bsToTransition(b: string, s: string): {
  birth: number[];
  survive: number[];
} {
  const bs = b.split("").map((x) => Number(x)).sort((a, b) => a - b);
  const ss = s.split("").map((x) => Number(x)).sort((a, b) => a - b);
  if (bs.includes(9) || ss.includes(9)) {
    throw new Error("include 9");
  }

  return {
    birth: bs,
    survive: ss,
  };
}

export function stringifyOuterTotalistic(
  rule: OuterTotalisticRule,
): string {
  const birth = rule.transition.birth;
  const survive = rule.transition.survive;
  if (birth.some((x) => !Number.isInteger(x) || x < 0 || x > 8)) {
    throw new Error("birth should be 0-9");
  }

  if (survive.some((x) => !Number.isInteger(x) || x < 0 || x > 8)) {
    throw new Error("survive should be 0-9");
  }

  const b = birth.slice().sort((a, b) => a - b).join("");
  const s = survive.slice().sort((a, b) => a - b).join("");
  const generations = rule.generations == null ? "" : `/${rule.generations}`;
  return `B${b}/S${s}${generations}${
    stringifyGridParameterWithColon(rule.gridParameter)
  }`;
}
