import { intModifiers } from "./int/pattern.ts";

// created by `createIndexed()`
/**
 * ```txt
 * 1   2   4
 * 8      16
 * 32 64 128
 * ```
 *
 * ```txt
 * intConditionArray = ["0", "1c", "1e", "2a", ..., "7e", "7c", "8"]
 * ```
 */
export const intConditionArray: INTCondition[] =
  `0 1c 1e 2a 1c 2c 2a 3i 1e 2a 2e 3a 2k 3n 3j 4a 1e 2k 2e 3j 2a 3n 3a 4a 2i 3r 3e 4r 3r 4i 4r 5i 1c 2c 2k 3n 2n 3c 3q 4n 2a 3i 3j 4a 3q 4n 4w 5a 2k 3y 3k 4k 3q 4y 4q 5j 3r 4t 4j 5n 4z 5r 5q 6a 1e 2k 2i 3r 2k 3y 3r 4t 2e 3j 3e 4r 3k 4k 4j 5n 2e 3k 3e 4j 3j 4k 4r 5n 3e 4j 4e 5c 4j 5y 5c 6c 2a 3n 3r 4i 3q 4y 4z 5r 3a 4a 4r 5i 4q 5j 5q 6a 3j 4k 4j 5y 4w 5k 5q 6k 4r 5n 5c 6c 5q 6k 6n 7c 1c 2n 2k 3q 2c 3c 3n 4n 2k 3q 3k 4q 3y 4y 4k 5j 2a 3q 3j 4w 3i 4n 4a 5a 3r 4z 4j 5q 4t 5r 5n 6a 2c 3c 3y 4y 3c 4c 4y 5e 3n 4n 4k 5j 4y 5e 5k 6e 3n 4y 4k 5k 4n 5e 5j 6e 4i 5r 5y 6k 5r 6i 6k 7e 2a 3q 3r 4z 3n 4y 4i 5r 3j 4w 4j 5q 4k 5k 5y 6k 3a 4q 4r 5q 4a 5j 5i 6a 4r 5q 5c 6n 5n 6k 6c 7c 3i 4n 4t 5r 4n 5e 5r 6i 4a 5a 5n 6a 5j 6e 6k 7e 4a 5j 5n 6k 5a 6e 6a 7e 5i 6a 6c 7c 6a 7e 7c 8`
    .trim()
    .split(/\s+/) as INTCondition[];

/**
 * <https://conwaylife.com/wiki/Isotropic_non-totalistic_rule#Square_grid>
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
  type: "int";
  transition: {
    birth: INTCondition[];
    survive: INTCondition[];
  };
  /**
   * [Generations | LifeWiki](https://conwaylife.com/wiki/Generations)
   */
  generations?: number;
};

/**
 * Parse {@link INTRule} as [Hensel notation](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule)
 */
export function parseIntRule(
  ruleString: string,
): INTRule {
  ruleString = ruleString.trim();

  // B/S
  {
    const bsRegex =
      /^(B|b)(?<birth>(\d|[cekainyqjrtwz-])*)\/(S|s)(?<survive>(\d|[cekainyqjrtwz-])*)(|\/(?<generations>\d+))$/;
    const match = ruleString.match(bsRegex);
    if (match) {
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
        };
      }
    }
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
      if (c === "0" || c === "8") {
        // If no letters follow, it's a basic condition (e.g., "3" means all configurations for 3 neighbors)
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

  return conditions;
}

function error(): never {
  throw new Error("internal");
}
