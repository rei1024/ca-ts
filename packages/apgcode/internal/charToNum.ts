const ZERO_CODE = "0".charCodeAt(0);
const NINE_CODE = "9".charCodeAt(0);
const LOWER_A_CODE = "a".charCodeAt(0);
const LOWER_V_CODE = "v".charCodeAt(0);
const LOWER_Z_CODE = "z".charCodeAt(0);

/**
 * @param char length is 1
 */
export function charToNum(char: string): number | null {
  const code = char.charCodeAt(0);
  if (ZERO_CODE <= code && code <= NINE_CODE) {
    return code - ZERO_CODE;
  }
  if (LOWER_A_CODE <= code && code <= LOWER_V_CODE) {
    return code - LOWER_A_CODE + 10;
  }

  return null;
}

/**
 * @param char length is 1
 */
export function charToNumForY(char: string): number | null {
  const code = char.charCodeAt(0);
  if (ZERO_CODE <= code && code <= NINE_CODE) {
    return code - ZERO_CODE + 4;
  }
  if (LOWER_A_CODE <= code && code <= LOWER_Z_CODE) {
    return code - LOWER_A_CODE + 4 + 10;
  }

  return null;
}
