import { parseRuleTableLine } from "./table/table-line.ts";
import type { RuleFormat, RuleTableLine } from "./types.ts";

const RULE_SECTION_PREFIX = "RULE ";

/**
 * Parse a rule format file.
 */
export function parseRuleFormat(ruleFileSource: string): RuleFormat {
  const sectionMap = parseRuleFormatRaw(ruleFileSource);
  const rule = sectionMap.get("RULE");
  if (!rule) {
    throw new Error("No @RULE section found");
  }
  const ruleName = rule.ruleName;
  if (!ruleName) {
    throw new Error("No rule name found");
  }

  if (ruleName.includes(" ") || ruleName.includes(":")) {
    throw new Error(`Invalid rule name: ${ruleName}`);
  }

  const table = sectionMap.get("TABLE");
  const parsedTable = table != null ? parseTable(table.lines) : null;

  const names = sectionMap.get("NAMES");

  let numberOfStates: number | undefined;
  if (parsedTable) {
    const states = parsedTable.find((x) => x.type === "n_states");
    if (!states) {
      throw new Error("no states count");
    } else {
      numberOfStates = states.numberOfStates;
    }
  }

  return {
    name: ruleName,
    description: rule.lines,
    rawSections: new Map([...sectionMap].map(([key, value]) => {
      return [
        key,
        value.lines,
      ];
    })),
    ...names
      ? {
        names: {
          stateNames: parseNames(names.lines, numberOfStates),
        },
      }
      : {},
    ...parsedTable
      ? {
        table: {
          lines: parsedTable,
        },
      }
      : {},
  };
}

function parseNames(
  lines: string[],
  numberOfStates: number | undefined,
): string[] {
  if (numberOfStates === undefined) {
    throw new Error("n_states is required");
  }

  const names = Array(numberOfStates).fill("");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0 || trimmedLine.startsWith("#")) {
      continue;
    }
    const array = trimmedLine.split(" ");
    const numberString = array[0];
    if (numberString !== undefined && /^\d+$/.test(numberString)) {
      const number = Number(numberString);
      if (0 <= number && number < numberOfStates) {
        names[number] = array.slice(1).join(" ");
      }
    }
  }

  return names;
}

function parseTable(lines: string[]): RuleTableLine[] {
  let nStates: number | undefined = undefined;
  let symmetries: string | undefined = undefined;
  let neighborhood: string | undefined = undefined;
  return lines.map((line) => {
    const parsed = parseRuleTableLine(line, nStates);
    if (parsed.type === "transition") {
      if (nStates === undefined) {
        throw new Error("n_states is not defined");
      }
      if (symmetries === undefined) {
        throw new Error("symmetries is not defined");
      }
      if (neighborhood === undefined) {
        throw new Error("neighborhood is not defined");
      }
    }
    if (parsed.type === "n_states") {
      if (nStates !== undefined) {
        throw new Error("Duplicate n_states line");
      }
      nStates = parsed.numberOfStates;
    }
    if (parsed.type === "symmetries") {
      if (symmetries !== undefined) {
        throw new Error("Duplicate symmetries line");
      }
      symmetries = parsed.symmetries;
    }
    if (parsed.type === "neighborhood") {
      if (neighborhood !== undefined) {
        throw new Error("Duplicate neighborhood line");
      }
      neighborhood = parsed.neighborhood;
    }
    return parsed;
  });
}

function parseRuleFormatRaw(ruleFileSource: string): Map<string, {
  // for @RULE
  ruleName?: string;
  lines: string[];
}> {
  const lines = ruleFileSource.split(/\r?\n/);

  const sectionMap = new Map<string, {
    // for @RULE
    ruleName?: string;
    lines: string[];
  }>();

  let currentSection: string | null = null;

  for (const [index, line] of lines.entries()) {
    if (line.startsWith("@")) {
      let sectionName = line.slice(1).trim();
      let ruleName: string | undefined = undefined;
      if (sectionName.startsWith(RULE_SECTION_PREFIX)) {
        ruleName = sectionName.slice(RULE_SECTION_PREFIX.length).trim();
        if (ruleName.length === 0) {
          throw new Error(`Invalid rule name at line ${index + 1}`);
        }
        sectionName = "RULE";
      }

      currentSection = sectionName;
      if (sectionMap.has(currentSection)) {
        throw new Error(
          `Duplicate section: ${currentSection} at line ${index + 1}`,
        );
      }
      sectionMap.set(currentSection, {
        ...ruleName ? { ruleName } : {},
        lines: [],
      });
    } else {
      if (currentSection) {
        const section = sectionMap.get(currentSection);
        if (section) {
          section.lines.push(line);
        }
      }
    }
  }

  return sectionMap;
}
