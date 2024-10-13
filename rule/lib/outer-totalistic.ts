/**
 * Outer-totalistic CA
 *
 * B/S notation
 */
export type OuterTotalisticRule = {
  type: "outer-totalistic";
  transition: {
    birth: number[];
    survive: number[];
  };
};

export type ParsedRule = OuterTotalisticRule;

/**
 * Parse {@link OuterTotalisticRule}
 *
 * @example
 * ```ts
parseOuterTotalistic("B3/S23")
// {
//   type: "outer-totalistic",
//   transition: { birth: [ 3 ], survive: [ 2, 3 ] }
// }
  ```
 */
export function parseOuterTotalistic(
  ruleString: string,
): OuterTotalisticRule | null {
  ruleString = ruleString.trim();

  // B/S
  {
    const bsRegex = /^B(\d*)\/S(\d*)$/;
    const match = ruleString.match(bsRegex);
    if (match) {
      const [_, b, s] = match;
      if (b !== undefined && s !== undefined) {
        return {
          type: "outer-totalistic",
          transition: bsToTransition(b, s),
        };
      }
    }
  }

  // S/B
  {
    const bsRegex = /^(\d*)\/(\d*)$/;
    const match = ruleString.match(bsRegex);
    if (match) {
      const [_, s, b] = match;
      if (b !== undefined && s !== undefined) {
        return {
          type: "outer-totalistic",
          transition: bsToTransition(b, s),
        };
      }
    }
  }

  return null;
}

function bsToTransition(b: string, s: string): {
  birth: number[];
  survive: number[];
} {
  const bs = b.split("").map((x) => Number(x)).sort((a, b) => a - b);
  const ss = s.split("").map((x) => Number(x)).sort((a, b) => a - b);
  return {
    birth: bs,
    survive: ss,
  };
}
