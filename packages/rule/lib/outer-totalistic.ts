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
  neighborhood?:
    | "von-neumann"
    | "hexagonal"
    | "triangular";
  /**
   * If `neighborhood` is `triangular`, this defines the type of triangular neighborhood.
   *
   * <https://conwaylife.com/wiki/Triangular_neighbourhood>
   */
  triangularType?:
    | "moore"
    | "edges"
    | "vertices"
    | "inner"
    | "outer"
    | "biohazard"
    | "radiation";
};

const triangularSuffixList = [
  "L",
  "LE",
  "LV",
  "LI",
  "LO",
  "LB",
  "LR",
];

const triangularTypeToSuffix = {
  "moore": "L",
  "edges": "LE",
  "vertices": "LV",
  "inner": "LI",
  "outer": "LO",
  "biohazard": "LB",
  "radiation": "LR",
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
  const originalRuleString = ruleString;

  const colonIndex = ruleString.indexOf(":");
  let gridParameter: GridParameter | null = null;
  if (colonIndex !== -1) {
    const gridParameterStr = ruleString.slice(colonIndex + 1); // +1 for ":"
    ruleString = ruleString.slice(0, colonIndex);
    gridParameter = parseGridParameter(gridParameterStr);
  }

  let neighborhood: OuterTotalisticRule["neighborhood"] | undefined;
  let triangularType: OuterTotalisticRule["triangularType"] | undefined;
  if (ruleString.endsWith("V") || ruleString.endsWith("v")) {
    neighborhood = "von-neumann";
    ruleString = ruleString.slice(0, -1);
  } else if (ruleString.endsWith("H") || ruleString.endsWith("h")) {
    neighborhood = "hexagonal";
    ruleString = ruleString.slice(0, -1);
  } else if (
    triangularSuffixList.some((x) => ruleString.endsWith(x))
  ) {
    neighborhood = "triangular";
    const suffix = triangularSuffixList.find((x) => ruleString.endsWith(x))!;
    ruleString = ruleString.slice(0, -suffix.length);

    triangularType = ({
      L: "moore",
      LE: "edges",
      LV: "vertices",
      LI: "inner",
      LO: "outer",
      LB: "biohazard",
      LR: "radiation",
    } as const)[suffix];
  }

  // B/S
  const bsRegex =
    /^(B|b)(?<birth>\d*)\/(S|s)(?<survive>\d*)(|\/(G|g|C|c)?(?<generations>\d+))$/;
  const bsRegexTriangular =
    /^(B|b)(?<birth>(\d|X|Y|Z)*)\/(S|s)(?<survive>(\d|X|Y|Z)*)(|\/(G|g|C|c)?(?<generations>\d+))$/;
  // S/B
  const sbRegex = /^(?<survive>\d*)\/(?<birth>\d*)(|\/(?<generations>\d+))$/;
  const sbRegexTriangular =
    /^(?<survive>(\d|X|Y|Z)*)\/(?<birth>(\d|X|Y|Z)*)(|\/(?<generations>\d+))$/;
  // G/B/S
  const gbsRegex =
    /^(G|g|C|c)(?<generations>\d+)\/(B|b)(?<birth>\d*)\/(S|s)(?<survive>\d*)$/;
  const gbsRegexTriangular =
    /^(G|g|C|c)(?<generations>\d+)\/(B|b)(?<birth>(\d|X|Y|Z)*)\/(S|s)(?<survive>(\d|X|Y|Z)*)$/;
  const match = neighborhood === "triangular" && triangularType === "moore"
    ? ((ruleString.match(bsRegexTriangular) ??
      ruleString.match(sbRegexTriangular)) ??
      ruleString.match(gbsRegexTriangular))
    : ((ruleString.match(bsRegex) ?? ruleString.match(sbRegex)) ??
      ruleString.match(gbsRegex));

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
        transition: bsToTransition(b, s, neighborhood, triangularType),
        ...generations == null ? {} : {
          generations: Number(generations),
        },
        ...neighborhood == null ? {} : {
          neighborhood,
        },
        ...gridParameter == null ? {} : {
          gridParameter,
        },
        ...triangularType == null ? {} : {
          triangularType,
        },
      };
    }
  }

  throw new Error(`Parse Error "${originalRuleString}"`);
}

function getMaxCount(
  neighborhood: OuterTotalisticRule["neighborhood"],
  triangularType: OuterTotalisticRule["triangularType"],
): number {
  if (neighborhood == undefined) {
    return 8;
  } else if (neighborhood === "von-neumann") {
    return 4;
  } else if (neighborhood === "hexagonal") {
    return 6;
  } else if (neighborhood === "triangular") {
    if (triangularType == undefined) {
      throw new Error(
        "triangularType is required when neighborhood is triangular",
      );
    }
    switch (triangularType) {
      case "edges":
      case "radiation":
        return 3;
      case "inner":
      case "outer":
        return 6;
      case "vertices":
      case "biohazard":
        return 9;
      case "moore":
        return 12;
    }
  }
  throw new Error("never");
}

function bsToTransition(
  b: string,
  s: string,
  neighborhood: OuterTotalisticRule["neighborhood"],
  triangularType: OuterTotalisticRule["triangularType"],
): {
  birth: number[];
  survive: number[];
} {
  const bs = toList(b);
  const ss = toList(s);

  const maxCount = getMaxCount(neighborhood, triangularType);

  if (bs.some((x) => !Number.isInteger(x) || x < 0 || x > maxCount)) {
    throw new Error(`birth should be 0 to ${numberToChar(maxCount)}`);
  }

  if (ss.some((x) => !Number.isInteger(x) || x < 0 || x > maxCount)) {
    throw new Error(`survive should be 0 to ${numberToChar(maxCount)}`);
  }

  return {
    birth: bs,
    survive: ss,
  };
}

function toList(numListString: string) {
  return numListString.split("").map((x) => {
    if (x === "X") return 10;
    if (x === "Y") return 11;
    if (x === "Z") return 12;
    return Number(x);
  }).sort((a, b) => a - b);
}

function numberToChar(n: number) {
  if (n === 10) return "X";
  if (n === 11) return "Y";
  if (n === 12) return "Z";
  return String(n);
}

export function stringifyOuterTotalistic(
  rule: OuterTotalisticRule,
): string {
  const birth = rule.transition.birth;
  const survive = rule.transition.survive;
  const maxCount = getMaxCount(
    rule.neighborhood,
    rule.triangularType,
  );

  if (rule.neighborhood !== "triangular" && rule.triangularType != undefined) {
    throw new Error(
      "triangularType is only valid when neighborhood is 'triangular'",
    );
  }

  if (birth.some((x) => !Number.isInteger(x) || x < 0 || x > maxCount)) {
    throw new Error(`birth should be 0 to ${maxCount}`);
  }

  if (survive.some((x) => !Number.isInteger(x) || x < 0 || x > maxCount)) {
    throw new Error(`survive should be 0 to ${maxCount}`);
  }

  const b = birth.slice().sort((a, b) => a - b).map((x) => numberToChar(x))
    .join("");
  const s = survive.slice().sort((a, b) => a - b).map((x) => numberToChar(x))
    .join("");
  const generations = rule.generations == null ? "" : `/${rule.generations}`;
  return `B${b}/S${s}${generations}${
    rule.neighborhood === "von-neumann"
      ? "V"
      : rule.neighborhood === "hexagonal"
      ? "H"
      : rule.neighborhood === "triangular"
      ? rule.triangularType == undefined
        ? (() => {
          throw new Error(
            "triangularType is required when neighborhood is triangular",
          );
        })()
        : triangularTypeToSuffix[rule.triangularType]
      : ""
  }${stringifyGridParameterWithColon(rule.gridParameter)}`;
}
