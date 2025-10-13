const ZERO_CODE = "0".charCodeAt(0);
const NINE_CODE = "9".charCodeAt(0);
const LOWER_A_CODE = "a".charCodeAt(0);
const LOWER_V_CODE = "v".charCodeAt(0);
const LOWER_Z_CODE = "z".charCodeAt(0);

export function numToChar(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("invalid number");
  }

  if (n <= 9) {
    return n.toString();
  }

  if (n <= 31) {
    return String.fromCharCode(n - 10 + LOWER_A_CODE);
  }

  throw new Error("invalid number");
}

export function numToCharForYSingleChar(n: number): string {
  if (!Number.isInteger(n) || n < 4) {
    throw new Error("invalid number");
  }

  if (n <= 4 + 9) {
    return String.fromCharCode(n - 4 + ZERO_CODE);
  }

  if (n <= 39) {
    return String.fromCharCode(n - 10 - 4 + LOWER_A_CODE);
  }

  throw new Error("invalid number");
}

export function numToCharForY(n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("invalid number");
  }

  if (n === 1) {
    return "0";
  } else if (n === 2) {
    return "w";
  } else if (n === 3) {
    return "x";
  } else {
    return "y" + numToCharForYSingleChar(n);
  }
}
