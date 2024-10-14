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

import {
  type OuterTotalisticRule,
  parseOuterTotalistic,
} from "./lib/outer-totalistic.ts";

export type { OuterTotalisticRule };

/**
 * Rule of a cellular automaton.
 */
export type ParsedRule = OuterTotalisticRule;

/**
 * Parse a rulestring.
 */
export function parseRule(ruleString: string): ParsedRule {
  ruleString = ruleString.trim();

  try {
    const outerTotalistic = parseOuterTotalistic(ruleString);
    return outerTotalistic;
  } catch {
    // nop
  }

  throw new Error("Parse error");
}
