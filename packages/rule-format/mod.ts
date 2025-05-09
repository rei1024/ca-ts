/**
 * Rule format parser.
 *
 * @example
 * ```ts
 * import { parseRuleFormat } from "@ca-ts/rule-format";
 * parseRuleFormat([
 *   "@RULE SomeRule",
 *   "@TABLE",
 *   "n_states:5",
 *   "neighborhood:vonNeumann",
 *   "symmetries:rotate4",
 *   "0,1,2,3,4",
 *   "3,4,0,1,2"
 * ].join("\n"));
 * ```
 *
 * @module
 */
export type { RuleFormat, RuleTableLine } from "./internal/types.ts";
export { parseRuleFormat } from "./internal/parse-rule-format.ts";
