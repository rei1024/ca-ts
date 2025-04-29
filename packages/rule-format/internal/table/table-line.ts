import type { RuleTableLine } from "../types.ts";

export function parseRuleTableLine(line: string): RuleTableLine {
  line = line.trim();

  if (line.length === 0) {
    return { type: "empty" };
  }

  if (line.startsWith("#")) {
    return { type: "comment", comment: line };
  }

  if (line.startsWith("n_states:")) {
    const numberOfStates = parseInt(line.slice(9).trim(), 10);
    return { type: "n_states", numberOfStates };
  }

  if (line.startsWith("neighborhood:")) {
    const neighborhood = line.slice(13).trim() as
      | "vonNeumann"
      | "Moore"
      | "hexagonal";
    return { type: "neighborhood", neighborhood };
  }

  if (line.startsWith("symmetries:")) {
    const symmetries = line.slice(11).trim();
    return { type: "symmetries", symmetries };
  }

  if (line.startsWith("var ")) {
    const variablePart = line.slice(4).trim();
    const [name, valuesString] = variablePart.split("=").map((s) => s.trim());
    if (!name || !valuesString) {
      throw new Error(`Invalid variable line: ${line}`);
    }
    if (
      valuesString.length < 2 || valuesString[0] !== "{" ||
      valuesString[valuesString.length - 1] !== "}"
    ) {
      throw new Error(`Invalid variable values: ${valuesString} in ${line}`);
    }
    const values = valuesString.slice(1, -1).split(",").map((v) => v.trim());
    if (values.some((v) => v.length === 0)) {
      throw new Error(`Invalid variable values: ${valuesString} in ${line}`);
    }
    return {
      type: "variable",
      variable: {
        name,
        values,
      },
    };
  }

  const transitionParts = line.split(",").map((part) => part.trim());
  if (transitionParts.length < 2) {
    throw new Error(`Invalid transition line: ${line}`);
  }

  for (const part of transitionParts) {
    if (part.length === 0) {
      throw new Error(`Invalid transition part: ${part} in ${line}`);
    }
  }

  const condition = transitionParts.slice(0, -1);
  const to = transitionParts[transitionParts.length - 1]!;
  return { type: "transition", transition: { condition, to } };
}

export function stringifyRuleTableLine(line: RuleTableLine): string {
  switch (line.type) {
    case "empty": {
      return "";
    }
    case "comment": {
      return line.comment;
    }
    case "n_states": {
      return `n_states:${line.numberOfStates}`;
    }
    case "neighborhood": {
      return `neighborhood:${line.neighborhood}`;
    }
    case "symmetries": {
      return `symmetries:${line.symmetries}`;
    }
    case "variable": {
      return `var ${line.variable.name}={${line.variable.values.join(",")}}`;
    }
    case "transition": {
      return `${line.transition.condition.join(",")},${line.transition.to}`;
    }
  }
}
