import { type GridParameter, parseGridParameter } from "./../../grid/mod.ts";
import { intModifiers } from "./int-condition.ts";

/**
 * A condition of the INT rule.
 *
 * [Isotropic non-totalistic rule > Square grid | LifeWiki](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule#Square_grid)
 *
 * ```ts ignore
 * type INTCondition = "0" | "1c" | "1e" | "2c" | ... | "7e" | "7c" | "8"
 */
export type INTCondition =
  | `0`
  | `1${typeof intModifiers["1"][number]}`
  | `2${typeof intModifiers["2"][number]}`
  | `3${typeof intModifiers["3"][number]}`
  | `4${typeof intModifiers["4"][number]}`
  | `5${typeof intModifiers["5"][number]}`
  | `6${typeof intModifiers["6"][number]}`
  | `7${typeof intModifiers["7"][number]}`
  | `8`;

/**
 * Isotropic non-totalistic rule
 *
 * [Isotropic non-totalistic rule | LifeWiki](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule)
 */
export type INTRule = {
  /**
   * Isotropic non-totalistic rule
   */
  type: "int";
  /**
   * Example: `B3k/S2ce` -> `{ birth: ["3k"], survive: ["2c", "2e"] }`
   */
  transition: {
    /** Conditions for birth. */
    birth: INTCondition[];
    /** Conditions for survival. */
    survive: INTCondition[];
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
 * Parse {@link INTRule} as [Hensel notation](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule)
 */
export function parseIntRule(
  ruleString: string,
): INTRule {
  ruleString = ruleString.trim();

  const colonIndex = ruleString.indexOf(":");
  let gridParameter: GridParameter | null = null;
  if (colonIndex !== -1) {
    const gridParameterStr = ruleString.slice(colonIndex + 1); // +1 for ":"
    ruleString = ruleString.slice(0, colonIndex);
    gridParameter = parseGridParameter(gridParameterStr);
  }

  const bsRegex =
    // cspell:disable-next-line
    /^(B|b)(?<birth>(\d|[cekainyqjrtwz-])*)\/(S|s)(?<survive>(\d|[cekainyqjrtwz-])*)(|\/(?<generations>\d+))$/;
  const sbRegex =
    // cspell:disable-next-line
    /^(?<survive>(\d|[cekainyqjrtwz-])*)\/(?<birth>(\d|[cekainyqjrtwz-])*)(|\/(?<generations>\d+))$/;
  const match = ruleString.match(bsRegex) ?? ruleString.match(sbRegex);
  if (!match) {
    throw new Error("Parse Error");
  }

  const b = match.groups?.birth;
  const s = match.groups?.survive;
  const generations = match.groups?.generations;
  if (b !== undefined && s !== undefined) {
    return {
      type: "int",
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
  birth: INTCondition[];
  survive: INTCondition[];
} {
  return {
    birth: toCondition(b),
    survive: toCondition(s),
  };
}

function toCondition(str: string): INTCondition[] {
  const conditions: INTCondition[] = [];
  let i = 0;

  while (i < str.length) {
    let negating = false; // To handle negation

    const c = str[i] ?? error();

    // Parse the numeric part (e.g., "1", "2", "3", etc.)
    const num = parseInt(c, 10);

    if (isNaN(num) || num < 0 || num > 8) {
      throw new Error(`Invalid number in rule string: '${c}'`);
    }

    i++;
    // Check for negation sign
    if (i < str.length && str[i] === "-") {
      negating = true;
      i++;
    }

    // Get all possible letters for this number from the `intConditions` mapping
    const possibleLetters =
      intModifiers[num as keyof typeof intModifiers] as readonly string[];

    // Check if there's a modifier (letter) for this number (e.g., "e", "c")
    const letters: string[] = [];

    while (i < str.length && possibleLetters.includes(str[i] ?? "")) {
      letters.push(str[i] ?? error());
      i++;
    }

    if (letters.length === 0) {
      // If no letters follow, it's a basic condition (e.g., "3" means all configurations for 3 neighbors)
      if (c === "0" || c === "8") {
        conditions.push(c as INTCondition);
      } else {
        for (const letter of possibleLetters) {
          conditions.push(`${num}${letter}` as INTCondition);
        }
      }
    } else {
      // Non-negated: Add the listed letters as conditions
      // Negated: Add complement of the listed letters
      const addLetters = negating
        ? possibleLetters.filter((l) => !letters.includes(l))
        : letters;
      for (const letter of addLetters) {
        conditions.push(`${num}${letter}` as INTCondition);
      }
    }
  }

  // sort to canonical order
  return conditions.sort();
}

function error(): never {
  throw new Error("internal");
}
