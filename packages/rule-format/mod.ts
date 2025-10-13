/**
 * Rule format parser.
 *
 * @example
 * ```ts
 * import { parseRuleFormat, resolveTable } from "@ca-ts/rule-format";
 * const ruleFormat = parseRuleFormat([
 *   "@RULE SomeRule",
 *   "@TABLE",
 *   "n_states:6",
 *   "neighborhood:Moore",
 *   "symmetries:rotate4",
 *   "1,1,1,1,1,1,1,1,1,1",
 * ].join("\n"));
 * const transitionMap = resolveTable(ruleFormat.table?.lines ?? [])
 * ```
 * @module
 */
export type { RuleFormat, RuleTableLine } from "./internal/types.ts";
export { parseRuleFormat } from "./internal/parse-rule-format.ts";
export { resolveTable } from "./internal/resolver/resolve-table.ts";
export { TransitionMap } from "./internal/resolver/transition-to-map.ts";
