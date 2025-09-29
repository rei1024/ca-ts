// https://conwaylife.com/wiki/Hexagonal_neighbourhood

export const hexagonalINTModifiers = {
  // FIXME: should include a empty string
  0: [],
  1: [],
  2: ["o", "m", "p"],
  3: ["o", "m", "p"],
  4: ["o", "m", "p"],
  5: [],
  6: [],
} as const;
