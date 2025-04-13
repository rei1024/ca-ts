import type { INTCondition, INTRule } from "../../mod.ts";
import { stringifyGridParameterWithColon } from "../grid/mod.ts";
import { intModifiers } from "./int-condition.ts";

/**
 * Convert an INT rule to a string.
 *
 * Using Hensel notation.
 */
export function stringifyINT(rule: INTRule): string {
  const birth = rule.transition.birth;
  const survive = rule.transition.survive;

  // Validation
  {
    if (rule.generations != null) {
      if (!Number.isInteger(rule.generations)) {
        throw new Error("Generation should be an integer");
      }
      if (rule.generations < 2) {
        throw new Error("Generation should be greater than or equal to 2");
      }
    }

    const all = getAllINTConditions();

    const unknownBirth = birth.filter((c) => !all.includes(c));
    const unknownSurvive = survive.filter((c) => !all.includes(c));
    if (unknownBirth.length !== 0 || unknownSurvive.length !== 0) {
      throw new Error(
        "Unknown condition " +
          unknownBirth.concat(unknownSurvive).join(
            ", ",
          ),
      );
    }

    if (birth.length !== new Set(birth).size) {
      throw new Error("Duplicated condition in birth");
    }

    if (survive.length !== new Set(survive).size) {
      throw new Error("Duplicated condition in survive");
    }
  }

  const generations = rule.generations != null
    ? ("/" + rule.generations.toString())
    : "";

  return `B${encodeConditions(birth)}/S${
    encodeConditions(survive)
  }${generations}${stringifyGridParameterWithColon(rule.gridParameter)}`;
}

function encodeConditions(cs: INTCondition[]): string {
  // Alphabetical order is generally seen
  cs = cs.slice().sort();
  const countToConditionLetters = new Map<number, string[]>();
  for (const c of cs) {
    const count = Number(c[0]);
    if (countToConditionLetters.get(count) === undefined) {
      countToConditionLetters.set(count, []);
    }
    countToConditionLetters.get(count)?.push(c[1] ?? "");
  }

  let conditionString = "";

  for (const [count, conditions] of countToConditionLetters.entries()) {
    if (count === 0 || count === 8) {
      conditionString += count.toString();
      continue;
    }

    if (conditions.length === 0) {
      continue;
    }

    conditionString += count.toString();

    let finalConditions = conditions;

    // deno-lint-ignore no-explicit-any
    const possibleLetters: string[] = (intModifiers as any)[count];
    const negatedLettersLength = possibleLetters.length - conditions.length +
      1; // +1 for "-"
    if (possibleLetters.length === conditions.length) {
      // all conditions
      // empty
      finalConditions = [];
    } else if (negatedLettersLength < conditions.length) {
      // Minimize letter count
      conditionString += "-";
      finalConditions = possibleLetters.slice().sort().filter((c) =>
        !conditions.includes(c)
      );
    }

    conditionString += finalConditions.join("");
  }

  return conditionString;
}

function getAllINTConditions() {
  return Object.entries(intModifiers).flatMap(([n, a]) => a.map((c) => n + c))
    .concat(["0", "8"]);
}
