import { type GridParameter, parseGridParameter } from "./../../grid/mod.ts";
import { hexagonalINTModifiers } from "./hex-int-condition.ts";

/**
 * A condition of the Hexagonal neighborhood INT rule.
 *
 * [Hexagonal neighbourhood > Isotropic non-totalistic rules | LifeWiki](https://conwaylife.com/wiki/Hexagonal_neighbourhood#Isotropic_non-totalistic_rules)
 */
export type HexagonalINTCondition =
  | `0`
  | `1`
  | `2${typeof hexagonalINTModifiers["2"][number]}`
  | `3${typeof hexagonalINTModifiers["3"][number]}`
  | `4${typeof hexagonalINTModifiers["4"][number]}`
  | `5`
  | `6`;

/**
 * Hexagonal neighborhood isotropic non-totalistic rule
 *
 * [Hexagonal neighbourhood > Isotropic non-totalistic rules | LifeWiki](https://conwaylife.com/wiki/Hexagonal_neighbourhood#Isotropic_non-totalistic_rules)
 */
export type HexagonalINTRule = {
  /**
   * Hexagonal neighborhood isotropic non-totalistic rule
   */
  type: "hexagonal-int";
  /** */
  transition: {
    /** Conditions for birth. */
    birth: HexagonalINTCondition[];
    /** Conditions for survival. */
    survive: HexagonalINTCondition[];
  };
  /**
   * If provided, number of states for the [Generations](https://conwaylife.com/wiki/Generations) rule.
   */
  generations?: number;
  /**
   * [Bounded grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
   */
  gridParameter?: GridParameter;
};

/**
 * Parse {@link HexagonalINTRule}
 */
export function parseHexagonalIntRule(
  ruleString: string,
): HexagonalINTRule {
  ruleString = ruleString.trim();

  const colonIndex = ruleString.indexOf(":");
  let gridParameter: GridParameter | null = null;
  if (colonIndex !== -1) {
    const gridParameterStr = ruleString.slice(colonIndex + 1); // +1 for ":"
    ruleString = ruleString.slice(0, colonIndex);
    gridParameter = parseGridParameter(gridParameterStr);
  }

  if (!ruleString.endsWith("H")) {
    throw new Error(`must end with "H"`);
  }

  ruleString = ruleString.slice(0, -1);

  const bsRegex =
    // cspell:disable-next-line
    /^(B|b)(?<birth>(\d|[omp-])*)\/(S|s)(?<survive>(\d|[omp-])*)(|\/(?<generations>\d+))$/;
  const sbRegex =
    // cspell:disable-next-line
    /^(?<survive>(\d|[omp-])*)\/(?<birth>(\d|[omp-])*)(|\/(?<generations>\d+))$/;
  const match = ruleString.match(bsRegex) ?? ruleString.match(sbRegex);
  if (!match) {
    throw new Error("Parse Error");
  }

  const b = match.groups?.birth;
  const s = match.groups?.survive;
  const generations = match.groups?.generations;
  if (b !== undefined && s !== undefined) {
    return {
      type: "hexagonal-int",
      transition: bsToTransition(b, s),
      ...generations == null ? {} : {
        generations: Number(generations),
      },
      ...gridParameter == null ? {} : {
        gridParameter,
      },
    };
  }

  throw new Error("Parse Error");
}

function bsToTransition(b: string, s: string): {
  birth: HexagonalINTCondition[];
  survive: HexagonalINTCondition[];
} {
  return {
    birth: toCondition(b),
    survive: toCondition(s),
  };
}

function toCondition(str: string): HexagonalINTCondition[] {
  const conditions: HexagonalINTCondition[] = [];
  let i = 0;

  while (i < str.length) {
    let negating = false; // To handle negation

    const c = str[i] ?? error();

    // Parse the numeric part (e.g., "1", "2", "3", etc.)
    const num = parseInt(c, 10);

    if (isNaN(num) || num < 0 || num > 6) {
      throw new Error(`Invalid number in rule string: '${c}'`);
    }

    i++;
    // Check for negation sign
    if (i < str.length && str[i] === "-") {
      negating = true;
      i++;
    }

    // Get all possible letters for this number from the `intConditions` mapping
    const possibleLetters = hexagonalINTModifiers[
      num as keyof typeof hexagonalINTModifiers
    ] as readonly string[];

    // Check if there's a modifier (letter) for this number (e.g., "e", "c")
    const letters: string[] = [];

    while (i < str.length && possibleLetters.includes(str[i] ?? "")) {
      letters.push(str[i] ?? error());
      i++;
    }

    if (letters.length === 0) {
      // If no letters follow, it's a basic condition (e.g., "3" means all configurations for 3 neighbors)
      if (c === "0" || c === "1" || c === "5" || c === "6") {
        conditions.push(c as HexagonalINTCondition);
      } else {
        for (const letter of possibleLetters) {
          conditions.push(`${num}${letter}` as HexagonalINTCondition);
        }
      }
    } else {
      // Non-negated: Add the listed letters as conditions
      // Negated: Add complement of the listed letters
      const addLetters = negating
        ? possibleLetters.filter((l) => !letters.includes(l))
        : letters;
      for (const letter of addLetters) {
        conditions.push(`${num}${letter}` as HexagonalINTCondition);
      }
    }
  }

  // sort to canonical order
  return conditions.sort();
}

function error(): never {
  throw new Error("internal");
}
