/**
 * Rulestring parser and writer.
 *
 * ### Parse a rulestring
 * ```ts
 * import { parseRule } from "@ca-ts/rule";
 * import { assertEquals } from "@std/assert";
 *
 * // Outer-totalistic rule
 * const rule = parseRule("B3/S23");
 * assertEquals(rule, {
 *   type: "outer-totalistic",
 *   transition: {
 *     birth: [3],
 *     survive: [2, 3],
 *    },
 * });
 *
 * // Isotropic non-totalistic (INT) rule
 * const intRule = parseRule("B3k/S2ce");
 * assertEquals(intRule, {
 *   type: "int",
 *   transition: {
 *     birth: ["3k"],
 *     survive: ["2c", "2e"],
 *    },
 * });
 *
 * // Non-isotropic rule (MAP string)
 * const mapRule = parseRule("MAPAAD//w");
 * assertEquals(mapRule.type === 'map' ? mapRule.neighbors : '', "von-neumann");
 * ```
 *
 * ### With grid topology
 * ```ts
 * import { parseRule } from "@ca-ts/rule";
 * import { assertEquals } from "@std/assert";
 *
 * // Torus with width 30 and height 20
 * const rule = parseRule("B3/S23:T30,20");
 * assertEquals(rule, {
 *   type: "outer-totalistic",
 *   transition: {
 *     birth: [3],
 *     survive: [2, 3],
 *    },
 *    gridParameter: {
 *      topology: { type: 'T', shift: null },
 *      size: { width: 30, height: 20 }
 *    },
 * });
 * ```
 *
 * ### Reference
 * - [Rulestring | LifeWiki](https://conwaylife.com/wiki/Rulestring)
 * - [QuickLife | Golly Help](https://golly.sourceforge.io/Help/Algorithms/QuickLife.html)
 * - [Bounded Grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
 * - [Hensel notation | LifeWiki](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule#Hensel_notation)
 * - [Non-isotropic rule | LifeWiki](https://conwaylife.com/wiki/Non-isotropic_rule)
 * @module
 */

import { alias } from "./lib/alias.ts";
import {
  type OuterTotalisticRule,
  parseOuterTotalistic,
  stringifyOuterTotalistic,
} from "./lib/outer-totalistic.ts";
import {
  type INTCondition,
  type INTRule,
  parseIntRule,
} from "./lib/int/moore/parse-int.ts";
import { stringifyINT } from "./lib/int/moore/stringify-int.ts";
import {
  type HexagonalINTCondition,
  type HexagonalINTRule,
  parseHexagonalIntRule,
} from "./lib/int/hex/parse-hexagonal-int.ts";
import { stringifyHexagonalINT } from "./lib/int/hex/stringify-hexagonal-int.ts";
import { parseMapRule } from "./lib/map/parse-map.ts";
import type { MAPRule } from "./lib/map/core.ts";
import { stringifyMap } from "./lib/map/stringify-map.ts";
import type { GridParameter } from "./lib/grid/mod.ts";
import { ParseRuleError } from "./lib/core.ts";

export type { OuterTotalisticRule };
export type { INTCondition, INTRule };
export type { HexagonalINTCondition, HexagonalINTRule };
export type { MAPRule };
export type { GridParameter };
export { ParseRuleError };

/**
 * Rule of a cellular automaton.
 */
export type ParsedRule =
  | OuterTotalisticRule
  | INTRule
  | HexagonalINTRule
  | MAPRule;

const aggregateErrorAvailable = typeof AggregateError !== "undefined";

/**
 * Parse a rulestring.
 * ### Example
 * Outer totalistic rule
 * ```ts
 * import { parseRule } from "@ca-ts/rule";
 * const rule = parseRule("B3/S23");
// rule = {
//   type: "outer-totalistic",
//   transition: {
//     birth: [3],
//     survive: [2, 3],
//    },
// }
 * ```
 *
 * Isotropic non-totalistic rule
 * ```ts
 * import { parseRule } from "@ca-ts/rule";
 * const rule = parseRule("B3k/S4i");
// rule = {
//   type: "int",
//   transition: {
//     birth: ["3k"],
//     survive: ["4i"],
//   },
// }
 * ```
 * Throws {@link AggregateError}. an element of `errors` property is either `Error` or `ParseRuleError`
 */
export function parseRule(ruleString: string): ParsedRule {
  ruleString = ruleString.trim();

  ruleString = alias(ruleString);

  const errors: Error[] = [];

  try {
    const map = parseMapRule(ruleString);
    return map;
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  try {
    const outerTotalistic = parseOuterTotalistic(ruleString);
    return outerTotalistic;
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  try {
    const int = parseIntRule(ruleString);
    return int;
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  try {
    const hexInt = parseHexagonalIntRule(ruleString);
    return hexInt;
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  if (aggregateErrorAvailable) {
    throw new AggregateError(errors, "Parse error");
  } else {
    throw new Error("Parse error");
  }
}

/**
 * Stringify a rule.
 * ### Example
 * ```ts
 * import { stringifyRule } from "@ca-ts/rule";
 * const rule = {
 *   type: "outer-totalistic" as const,
 *   transition: {
 *     birth: [3],
 *     survive: [2, 3],
 *   },
 * };
 * const ruleString = stringifyRule(rule);
 * // ruleString = "B3/S23"
 * ```
 */
export function stringifyRule(rule: ParsedRule): string {
  switch (rule.type) {
    case "int": {
      return stringifyINT(rule);
    }
    case "map": {
      return stringifyMap(rule);
    }
    case "outer-totalistic": {
      return stringifyOuterTotalistic(rule);
    }
    case "hexagonal-int": {
      return stringifyHexagonalINT(rule);
    }
  }
}
