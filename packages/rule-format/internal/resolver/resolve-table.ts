import type { RuleTableLine } from "../../mod.ts";
import { applyIndices, symmetryMap } from "./symmetry-map.ts";
import { type TransitionMap, transitionToMap } from "./transition-to-map.ts";

const neighborhoodCount = {
  vonNeumann: 4,
  Moore: 8,
  hexagonal: 6,
};

/**
 * Create {@link TransitionMap}
 */
export function resolveTable(lines: RuleTableLine[]): TransitionMap {
  const nStates = lines.find((line) => line.type === "n_states")
    ?.numberOfStates;
  const neighborhood = lines.find((line) => line.type === "neighborhood")
    ?.neighborhood;
  const symmetries = lines.find((line) => line.type === "symmetries")
    ?.symmetries;
  const variables = lines.filter((line) => line.type === "variable").map((
    line,
  ) => line.variable);
  const transitions = lines.filter((line) => line.type === "transition").map((
    line,
  ) => line.transition);

  if (
    nStates === undefined || neighborhood === undefined ||
    symmetries === undefined
  ) {
    throw new Error("Missing required fields in table");
  }

  const variableResolvedTransitions = resolveVariableTransition(
    variables,
    transitions,
  ).map((transition) => {
    const condition = transition.condition.map((part) => {
      if (/^[0-9]+$/.test(part)) {
        return Number(part);
      } else {
        throw new Error(
          `Invalid transition condition: ${part} is not a number`,
        );
      }
    });
    const to = transition.to;
    if (/^[0-9]+$/.test(to)) {
      return {
        condition,
        to: Number(to),
      };
    } else {
      throw new Error(
        `Invalid transition to: ${to} is not a number`,
      );
    }
  });

  // validation
  const expectedConditionLength = neighborhoodCount[neighborhood] + 1;
  for (const transition of variableResolvedTransitions) {
    if (transition.condition.some((value) => value >= nStates)) {
      throw new Error(
        `Invalid transition condition: ${
          transition.condition.join(",")
        } for n_states: ${nStates}`,
      );
    }

    if (transition.to >= nStates) {
      throw new Error(
        `Invalid transition to: ${transition.to} for n_states: ${nStates}`,
      );
    }

    if (expectedConditionLength !== transition.condition.length) {
      throw new Error(
        `Invalid transition condition length: ${
          transition.condition.join(",")
        } for neighborhood: ${neighborhood}`,
      );
    }
  }

  if (neighborhood !== "Moore") {
    throw new Error("TODO");
  }

  const symmetry = symmetryMap[neighborhood][symmetries as "rotate4"];
  if (symmetry === undefined) {
    throw new Error("Unknown symmetry " + symmetries);
  }
  const symmetryResolved = variableResolvedTransitions.flatMap((x) => {
    return symmetry.map((indices) => {
      return {
        condition: applyIndices(x.condition, indices),
        to: x.to,
      };
    });
  });

  return transitionToMap(symmetryResolved);
}

type Variable = (RuleTableLine & { type: "variable" })["variable"];
type Transition = (RuleTableLine & { type: "transition" })["transition"];

function resolveVariableExpand(variables: Variable[]): Map<string, Variable> {
  const variableMap = new Map<string, Variable>();
  for (const variable of variables) {
    const { name, values } = variable;
    if (variableMap.has(name)) {
      throw new Error(`Duplicate variable name: ${name}`);
    }

    const expandedValues: string[] = values.flatMap((value) => {
      if (/^[0-9]+$/.test(value)) {
        return value;
      } else {
        const resolvedValues = variableMap.get(value);
        if (resolvedValues === undefined) {
          throw new Error(`Variable not found: ${value}`);
        }
        return resolvedValues.values;
      }
    });

    variableMap.set(name, {
      name,
      values: expandedValues,
    });
  }

  return variableMap;
}

export function resolveVariableTransition(
  variables: Variable[],
  transitions: Transition[],
): Transition[] {
  const variableMap = resolveVariableExpand(variables);

  let result: Transition[] = [];
  for (const transition of transitions) {
    const transitionParts = transition.condition.concat([transition.to]);

    const usedVariableNames = new Set(
      transitionParts.flatMap((part) => /^[0-9]+$/.test(part) ? [] : [part]),
    );

    let temp = [transitionParts];
    for (const variableName of usedVariableNames) {
      const variable = variableMap.get(variableName);
      if (variable === undefined) {
        throw new Error(`Variable not found: ${variableName}`);
      }

      temp = temp.flatMap((part) => {
        return variable.values.map((value) => {
          return part.map((p) => p === variableName ? value : p);
        });
      });
    }

    result = result.concat(temp.map((parts) => {
      const condition = parts.slice(0, -1);
      const to = parts[parts.length - 1]!;
      return { condition, to };
    }));
  }

  return result;
}
