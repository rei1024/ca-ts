import {
  type GridParameter,
  parseGridParameter,
  stringifyGridParameterWithColon,
} from "./grid/mod.ts";

/**
 * Outer-totalistic cellular automaton rule.
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
    /**
     * The `birth` array defines the number of living neighbors a dead cell
     * must have for it to become alive in the next generation.
     */
    birth: number[];
    /**
     * The `survive` array defines the number of living neighbors a living
     * cell must have to remain alive in the next generation.
     */
    survive: number[];
  };
  /**
   * If provided, number of states for the [Generations](https://conwaylife.com/wiki/Generations) rule.
   */
  generations?: number;
  /**
   * [Bounded grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
   */
  gridParameter?: GridParameter;
  /**
   * Neighborhood
   *
   * `undefined` for Moore neighborhood.
   */
  neighborhood?: "von-neumann" | "hexagonal";
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

  let neighborhood: OuterTotalisticRule["neighborhood"] | undefined;
  if (ruleString.endsWith("V") || ruleString.endsWith("v")) {
    neighborhood = "von-neumann";
    ruleString = ruleString.slice(0, -1);
  } else if (ruleString.endsWith("H") || ruleString.endsWith("h")) {
    neighborhood = "hexagonal";
    ruleString = ruleString.slice(0, -1);
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
        transition: bsToTransition(b, s, neighborhood),
        ...generations == null ? {} : {
          generations: Number(generations),
        },
        ...neighborhood == null ? {} : {
          neighborhood,
        },
        ...gridParameter == null ? {} : {
          gridParameter,
        },
      };
    }
  }

  throw new Error("Parse Error");
}

function bsToTransition(
  b: string,
  s: string,
  neighborhood: OuterTotalisticRule["neighborhood"],
): {
  birth: number[];
  survive: number[];
} {
  const bs = toList(b);
  const ss = toList(s);
  if (bs.includes(9) || ss.includes(9)) {
    throw new Error("include 9");
  }

  if (neighborhood === "von-neumann") {
    if (bs.concat(ss).some((x) => x > 4)) {
      throw new Error("count is greater than 4 in von Neumann neighborhood");
    }
  } else if (neighborhood === "hexagonal") {
    if (bs.concat(ss).some((x) => x > 6)) {
      throw new Error("count is greater than 6 in hexagonal neighborhood");
    }
  }

  return {
    birth: bs,
    survive: ss,
  };
}

function toList(numListString: string) {
  return numListString.split("").map((x) => Number(x)).sort((a, b) => a - b);
}

export function stringifyOuterTotalistic(
  rule: OuterTotalisticRule,
): string {
  const birth = rule.transition.birth;
  const survive = rule.transition.survive;
  const maxCount = rule.neighborhood === "von-neumann"
    ? 4
    : rule.neighborhood === "hexagonal"
    ? 6
    : 8;
  if (birth.some((x) => !Number.isInteger(x) || x < 0 || x > maxCount)) {
    throw new Error(`birth should be 0 to ${maxCount}`);
  }

  if (survive.some((x) => !Number.isInteger(x) || x < 0 || x > maxCount)) {
    throw new Error(`survive should be 0 to ${maxCount}`);
  }

  const b = birth.slice().sort((a, b) => a - b).join("");
  const s = survive.slice().sort((a, b) => a - b).join("");
  const generations = rule.generations == null ? "" : `/${rule.generations}`;
  return `B${b}/S${s}${generations}${
    rule.neighborhood === "von-neumann"
      ? "V"
      : rule.neighborhood === "hexagonal"
      ? "H"
      : ""
  }${stringifyGridParameterWithColon(rule.gridParameter)}`;
}
