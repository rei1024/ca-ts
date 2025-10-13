import { stringifyGridParameterWithColon } from "../../grid/mod.ts";
import { hexagonalINTModifiers } from "./hex-int-condition.ts";
import type {
  HexagonalINTCondition,
  HexagonalINTRule,
} from "./parse-hexagonal-int.ts";

/**
 * Convert an Hexagonal neighbourhood INT rule to a string.
 */
export function stringifyHexagonalINT(rule: HexagonalINTRule): string {
  const birth = rule.transition.birth;
  const survive = rule.transition.survive;

  // Validation
  {
    if (rule.generations != null) {
      if (!Number.isInteger(rule.generations)) {
        throw new Error("Generations value should be an integer");
      }
      if (rule.generations < 2) {
        throw new Error(
          "Generations value should be greater than or equal to 2",
        );
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
  }${generations}H${stringifyGridParameterWithColon(rule.gridParameter)}`;
}

function encodeConditions(cs: HexagonalINTCondition[]): string {
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
    if (count === 0 || count == 1 || count === 5 || count === 6) {
      conditionString += count.toString();
      continue;
    }

    if (conditions.length === 0) {
      continue;
    }

    conditionString += count.toString();

    let finalConditions = conditions;

    // deno-lint-ignore no-explicit-any
    const possibleLetters: string[] = (hexagonalINTModifiers as any)[count];
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
  return Object.entries(hexagonalINTModifiers).flatMap(([n, a]) =>
    a.map((c) => n + c)
  )
    .concat(["0", "1", "5", "6"]);
}
