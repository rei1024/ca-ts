import type { RuleFormat } from "../mod.ts";

export function stringifyRuleFormat(ruleFormat: RuleFormat): string {
  let lines: string[] = [];
  for (const [key, value] of ruleFormat.rawSections) {
    if (key === "RULE") {
      lines.push(`@RULE ${ruleFormat.name}`);
    } else {
      lines.push(`@${key}`);
    }

    lines = lines.concat(value);
  }

  return lines.join("\n") + "\n";
}
