import { ParseRuleError } from "../../core.ts";
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
  const originalRuleString = ruleString; // Store the original for better error reporting

  const colonIndex = ruleString.indexOf(":");
  let gridParameter: GridParameter | null = null;
  if (colonIndex !== -1) {
    const gridParameterStr = ruleString.slice(colonIndex + 1); // +1 for ":"
    ruleString = ruleString.slice(0, colonIndex);
    gridParameter = parseGridParameter(gridParameterStr);
  }

  const bsRegex =
    // cspell:disable-next-line
    /^(B|b)(?<birth>(\d|[cekainyqjrtwz-])*)\/(S|s)(?<survive>(\d|[cekainyqjrtwz-])*)(|\/(G|g|C|c)?(?<generations>\d+))$/;
  const sbRegex =
    // cspell:disable-next-line
    /^(?<survive>(\d|[cekainyqjrtwz-])*)\/(?<birth>(\d|[cekainyqjrtwz-])*)(|\/(?<generations>\d+))$/;
  const match = ruleString.match(bsRegex) ?? ruleString.match(sbRegex);

  if (!match) {
    throw new ParseRuleError(
      `Invalid Isotropic Non-Totalistic (INT) rule format: "${ruleString}". Expected B/S or S/B notation (e.g., B3k/S2ce).`,
      "format",
    );
  }

  const b = match.groups?.birth;
  const s = match.groups?.survive;
  const generationsString = match.groups?.generations;

  if (b !== undefined && s !== undefined) {
    const generations = generationsString == null
      ? undefined
      : Number(generationsString);

    if (generations != null && generations < 2) {
      throw new ParseRuleError(
        `Generations value must be greater than or equal to 2.`,
        "generations",
      );
    }

    return {
      type: "int",
      transition: bsToTransition(b, s),
      ...generations == null ? {} : {
        generations: generations,
      },
      ...gridParameter == null ? {} : {
        gridParameter,
      },
    };
  }

  // This should only happen if regex matched but groups were unexpectedly empty/undefined
  throw new Error(
    `Rule string matched the pattern but failed to extract birth/survive conditions: "${ruleString}".`,
  );
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

    const c = str[i];

    // Parse the numeric part (e.g., "1", "2", "3", etc.)
    const num = parseInt(c!, 10); // Safe to use c! as we check i < str.length

    if (isNaN(num) || num < 0 || num > 8) {
      throw new Error(
        `Invalid neighbor count '${c}' found in condition string. For INT rules, counts must be between 0 and 8.`,
      );
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
      letters.push(str[i]!);
      i++;
    }

    if (letters.length === 0) {
      // If no letters follow, it's a basic condition (e.g., "3" means all configurations for 3 neighbors)
      if (c === "0" || c === "8") {
        conditions.push(c as INTCondition);
      } else {
        // If the number *can* have modifiers but none were specified, expand to all of them.
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
