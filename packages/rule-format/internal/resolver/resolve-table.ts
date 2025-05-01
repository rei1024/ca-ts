import type { RuleTableLine } from "../../mod.ts";

export function resolveTable(lines: RuleTableLine[]) {
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
    nStates === undefined || neighborhood === undefined
  ) {
    throw new Error("Missing required fields in table");
  }

  const variableResolvedTransitions = resolveVariableTransition(
    variables,
    transitions,
  );
}

type Variable = (RuleTableLine & { type: "variable" })["variable"];

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
  transitions: (RuleTableLine & { type: "transition" })["transition"][],
): (RuleTableLine & { type: "transition" })["transition"][] {
  const variableMap = resolveVariableExpand(variables);

  let result: (RuleTableLine & { type: "transition" })["transition"][] = [];
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
