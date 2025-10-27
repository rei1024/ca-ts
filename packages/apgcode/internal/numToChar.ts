const ZERO_CODE = "0".charCodeAt(0);
const NINE_CODE = "9".charCodeAt(0);
const LOWER_A_CODE = "a".charCodeAt(0);
const LOWER_V_CODE = "v".charCodeAt(0);
const LOWER_Z_CODE = "z".charCodeAt(0);

export function numToChar(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("invalid number " + n);
  }

  if (n <= 9) {
    return n.toString();
  }

  if (n <= 31) {
    return String.fromCharCode(n - 10 + LOWER_A_CODE);
  }

  throw new Error("invalid number " + n);
}

export function numToCharForYSingleChar(n: number): string {
  if (!Number.isInteger(n) || n < 4) {
    throw new Error("invalid number " + n);
  }

  if (n <= 4 + 9) {
    return String.fromCharCode(n - 4 + ZERO_CODE);
  }

  if (n <= 39) {
    return String.fromCharCode(n - 10 - 4 + LOWER_A_CODE);
  }

  throw new Error("invalid number " + n);
}

export function numToCharForY(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("invalid number " + n);
  }

  if (n === 0) {
    return "";
  }

  const quotient = Math.floor(n / 39);
  const remainder = n % 39;

  const yz = "yz".repeat(quotient);

  if (remainder === 0) {
    return yz;
  } else if (remainder === 1) {
    return yz + "0";
  } else if (remainder === 2) {
    return yz + "w";
  } else if (remainder === 3) {
    return yz + "x";
  } else {
    return yz + "y" + numToCharForYSingleChar(remainder);
  }
}
