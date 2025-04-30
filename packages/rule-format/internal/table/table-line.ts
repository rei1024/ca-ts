import type { RuleTableLine } from "../types.ts";

export function parseRuleTableLine(
  line: string,
  nStates: number | undefined,
): RuleTableLine {
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
    const [lineWithoutComment, lineComment] = splitComment(line);

    const variablePart = lineWithoutComment.slice(4).trim();
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
      ...lineComment.trim().length === 0 ? {} : { comment: lineComment },
    };
  }

  const [lineWithoutComment, lineComment] = splitComment(line);

  const transitionParts = lineWithoutComment.split(",").map((part) =>
    part.trim()
  );
  if (transitionParts.length < 2) {
    if (nStates === undefined) {
      throw new Error(`Number of states is not defined: ${line}`);
    }
    if (nStates >= 11) {
      throw new Error(`Invalid transition line: ${line}`);
    }

    if (!/^([0-9]+)$/.test(line)) {
      throw new Error(`Invalid transition line: ${line}`);
    }

    const digits = line.split("");
    const to = digits.pop()!;
    return { type: "transition", transition: { condition: digits, to } };
  }

  for (const part of transitionParts) {
    if (part.length === 0) {
      throw new Error(`Invalid transition part: ${part} in ${line}`);
    }
  }

  const condition = transitionParts.slice(0, -1);
  const to = transitionParts[transitionParts.length - 1]!;
  return {
    type: "transition",
    transition: { condition, to },
    ...lineComment.trim().length === 0 ? {} : { comment: lineComment },
  };
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
      return `var ${line.variable.name}={${line.variable.values.join(",")}}${
        line.comment ? ` ${line.comment}` : ""
      }`;
    }
    case "transition": {
      return `${line.transition.condition.join(",")},${line.transition.to}${
        line.comment ? ` ${line.comment}` : ""
      }`;
    }
  }
}

function splitComment(line: string): [string, string] {
  const index = line.indexOf("#");
  if (index === -1) {
    return [line, ""];
  }
  return [line.slice(0, index), line.slice(index)];
}
