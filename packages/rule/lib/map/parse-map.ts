import { type GridParameter, parseGridParameter } from "../grid/mod.ts";
import { decodeBase64 } from "@std/encoding/base64";
import type { MAPRule } from "./core.ts";
import { ParseRuleError } from "@ca-ts/rule";
import { decodeBase64Fallback } from "./decodeBase64-fallback.ts";

/** Number of base64 characters to encode 512 bits for Moore neighborhood */
const MAP512LENGTH = 86;
/** Number of base64 characters to encode 128 bits for Hex neighborhood */
const MAP128LENGTH = 22;
/** Number of base64 characters to encode 128 bits for von Neumann neighborhood */
const MAP32LENGTH = 6;

export function parseMapRule(ruleString: string): MAPRule {
  if (ruleString.slice(0, 3).toUpperCase() !== "MAP") {
    throw new ParseRuleError('Should start with "MAP"', "format");
  }
  ruleString = ruleString.slice(3);

  const colonIndex = ruleString.indexOf(":");
  let gridParameter: GridParameter | null = null;
  if (colonIndex !== -1) {
    const gridParameterStr = ruleString.slice(colonIndex + 1); // +1 for ":"
    ruleString = ruleString.slice(0, colonIndex);
    gridParameter = parseGridParameter(gridParameterStr);
  }

  if (ruleString.endsWith("==")) {
    ruleString = ruleString.slice(0, -2);
  }

  let neighbors: MAPRule["neighbors"];
  if (ruleString.length === MAP512LENGTH) {
    neighbors = "moore";
  } else if (ruleString.length === MAP128LENGTH) {
    neighbors = "hexagonal";
  } else if (ruleString.length === MAP32LENGTH) {
    neighbors = "von-neumann";
  } else {
    throw new ParseRuleError(
      `Invalid MAP string length: ${ruleString.length}.`,
      "transition",
    );
  }

  const decoded = decodeBase64Fallback(ruleString);

  const data: (0 | 1)[] = [...decoded].flatMap((byte) =>
    [7, 6, 5, 4, 3, 2, 1, 0].map((bit) => (byte >> bit) & 1) as (0 | 1)[]
  );

  return {
    type: "map",
    data: data as (0 | 1)[],
    neighbors,
    ...gridParameter == null ? {} : {
      gridParameter,
    },
  };
}
