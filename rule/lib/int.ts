const intModifiers = {
  0: [],
  1: ["c", "e"],
  2: ["c", "e", "k", "a", "i", "n"],
  3: ["c", "e", "k", "a", "i", "n", "y", "q", "j", "r"],
  4: ["c", "e", "k", "a", "i", "n", "y", "q", "j", "r", "t", "w", "z"],
  5: ["c", "e", "k", "a", "i", "n", "y", "q", "j", "r"],
  6: ["c", "e", "k", "a", "i", "n"],
  7: ["c", "e"],
  8: [],
} as const;

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
 * Hensel notation
 */
export type INTRule = {
  type: "int";
  transition: {
    birth: INTCondition[];
    survive: INTCondition[];
  };
};

/**
 * Parse {@link INTRule}
 */
export function parseIntRule(
  ruleString: string,
): INTRule {
  ruleString = ruleString.trim();

  // B/S
  {
    const bsRegex =
      /^B(?<birth>(\d|[cekainyqjrtwz-])*)\/S(?<survive>(\d|[cekainyqjrtwz-])*)$/;
    const match = ruleString.match(bsRegex);
    if (match) {
      const b = match.groups?.birth;
      const s = match.groups?.survive;
      if (b !== undefined && s !== undefined) {
        console.log(match);
        return {
          type: "int",
          transition: bsToTransition(b, s),
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
    const possibleLetters = intModifiers[num as keyof typeof intModifiers];

    // Check if there's a modifier (letter) for this number (e.g., "1e", "3c")
    const letters: string[] = [];

    // TODO: more strict check
    while (i < str.length && /[cekainyqjrtwz]/.test(str[i] ?? "")) {
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
      if (negating) {
        // Negated: Add complement of the listed letters
        const complementLetters = possibleLetters.filter((l) =>
          !letters.includes(l)
        );
        for (const letter of complementLetters) {
          conditions.push(`${num}${letter}` as INTCondition);
        }
      } else {
        // Non-negated: Add the listed letters as conditions
        for (const letter of letters) {
          conditions.push(`${num}${letter}` as INTCondition);
        }
      }
    }
  }

  return conditions;
}

function error(): never {
  throw new Error("internal");
}
