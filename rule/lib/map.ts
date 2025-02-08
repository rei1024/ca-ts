import { decodeBase64 } from "@std/encoding";

/**
 * Non-isotropic rule.
 *
 * <https://conwaylife.com/wiki/Rule_integer>
 */
export type MAPRule = {
  type: "map";
  /**
   * 512 bit binary string for Moore neighborhood
   *
   * ```txt
   * 256 128 64
   *  32  16  8
   *   4   2  1
   * ```
   */
  transition: (0 | 1)[];
  /**
   * [Generations](https://conwaylife.com/wiki/Generations)
   */
  generations?: number;
};

/**
 * Parse {@link MAPRule}
 */
export function parseMAPRule(
  ruleString: string,
) {
  if (!ruleString.startsWith("MAP")) {
    throw new Error("Invalid rule string");
  }

  ruleString = ruleString.slice(3);

  const bytes = decodeBase64(base64);

  if (bytes.length * 8 !== 512) {
    throw new Error("Invalid rule string");
  }

  const transition: (0 | 1)[] = [];

  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      transition.push(((byte >>> i) & 1) as 0 | 1);
    }
  }

  return {
    type: "map",
    transition,
    ...generations === undefined ? {} : { generations },
  };
}

function extractBase64(string: string) {
  if 
}