/**
 * Rulestring
 *
 * ### Example
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
 * ### Reference
 * - [Rulestring | LifeWiki](https://conwaylife.com/wiki/Rulestring)
 * - [QuickLife | Golly Help](https://golly.sourceforge.io/Help/Algorithms/QuickLife.html)
 * - [Bounded Grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
 * - [Hensel notation | LifeWiki](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule#Hensel_notation)
 * @module
 */

import { alias } from "./lib/alias.ts";
import {
  type OuterTotalisticRule,
  parseOuterTotalistic,
} from "./lib/outer-totalistic.ts";
import { type INTRule, parseIntRule } from "./lib/int.ts";

export type { OuterTotalisticRule };
export type { INTRule };

/**
 * Rule of a cellular automaton.
 */
export type ParsedRule = OuterTotalisticRule | INTRule;

/**
 * Parse a rulestring.
 * ### Example
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
 */
export function parseRule(ruleString: string): ParsedRule {
  ruleString = ruleString.trim();

  ruleString = alias(ruleString);

  try {
    const outerTotalistic = parseOuterTotalistic(ruleString);
    return outerTotalistic;
  } catch {
    // nop
  }

  try {
    const int = parseIntRule(ruleString);
    return int;
  } catch {
    // nop
  }

  throw new Error("Parse error");
}
