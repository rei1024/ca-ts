/**
 * ### Reference
 * - [Rulestring | LifeWiki](https://conwaylife.com/wiki/Rulestring)
 * - [QuickLife | Golly Help](https://golly.sourceforge.io/Help/Algorithms/QuickLife.html)
 * - [Bounded Grids | Golly Help](https://golly.sourceforge.io/Help/bounded.html)
 * - [Hensel notation | LifeWiki](https://conwaylife.com/wiki/Isotropic_non-totalistic_rule#Hensel_notation)
 */

import { parseOuterTotalistic } from "./lib/outer-totalistic.ts";

/**
 * B/S notation
 */
export type OuterTotalisticRule = {
  type: "outer-totalistic";
  transition: {
    birth: number[];
    survive: number[];
  };
};

export type ParsedRule = OuterTotalisticRule;

/**
 * Parse rulestring.
 */
export function parseRule(ruleString: string): ParsedRule {
  ruleString = ruleString.trim();

  const outerTotalistic = parseOuterTotalistic(ruleString);

  if (outerTotalistic) {
    return outerTotalistic;
  }

  throw new Error("Parse error");
}
