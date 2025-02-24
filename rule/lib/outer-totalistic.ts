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
  /**
   * [Generations | LifeWiki](https://conwaylife.com/wiki/Generations)
   */
  generations?: number;
};

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
): OuterTotalisticRule {
  ruleString = ruleString.trim();

  // B/S
  const bsRegex =
    /^(B|b)(?<birth>\d*)\/(S|s)(?<survive>\d*)(|\/(G|g|C|c)?(?<generations>\d+))$/;
  // S/B
  const sbRegex = /^(?<survive>\d*)\/(?<birth>\d*)(|\/(?<generations>\d+))$/;
  // G/B/S
  const gbsRegex =
    /^(G|g|C|c)(?<generations>\d+)\/(B|b)(?<birth>\d*)\/(S|s)(?<survive>\d*)$/;
  const match = (ruleString.match(bsRegex) ?? ruleString.match(sbRegex)) ??
    ruleString.match(gbsRegex);

  if (match) {
    const b = match.groups?.birth;
    const s = match.groups?.survive;
    const generations = match.groups?.generations;
    if (b !== undefined && s !== undefined) {
      return {
        type: "outer-totalistic",
        transition: bsToTransition(b, s),
        ...generations == null ? {} : {
          generations: Number(generations),
        },
      };
    }
  }

  throw new Error("Parse Error");
}

function bsToTransition(b: string, s: string): {
  birth: number[];
  survive: number[];
} {
  const bs = b.split("").map((x) => Number(x)).sort((a, b) => a - b);
  const ss = s.split("").map((x) => Number(x)).sort((a, b) => a - b);
  if (bs.includes(9) || ss.includes(9)) {
    throw new Error("include 9");
  }

  return {
    birth: bs,
    survive: ss,
  };
}
