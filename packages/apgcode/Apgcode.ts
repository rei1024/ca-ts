/**
 * Still life
 */
export type ApgcodeStillLife = {
  /** `xs` */
  type: "still-life";
  /** the population for the still life */
  population: number;
  /**
   * pattern
   *
   * sorted lexicographically on (y, x)
   */
  cells: { x: number; y: number }[];
};

/**
 * Oscillator
 */
export type ApgcodeOscillator = {
  /** `xp` */
  type: "oscillator";
  /** the period of the object */
  period: number;
  /**
   * pattern
   *
   * sorted lexicographically on (y, x)
   */
  cells: { x: number; y: number }[];
};

/**
 * Spaceship
 */
export type ApgcodeSpaceship = {
  /** `xq` */
  type: "spaceship";
  /** the period of the object */
  period: number;
  /**
   * pattern
   *
   * sorted lexicographically on (y, x)
   */
  cells: { x: number; y: number }[];
};

/**
 * Linear growth
 */
export type ApgcodeLinear = {
  /** `yl` */
  type: "linear";
  /** first value */
  populationGrowthPeriod: number;
  /** second value */
  debrisPeriod: number;
  /** third value */
  populationGrowthAmount: number;
  /** fourth value */
  hash: string;
};

/**
 * apgcode is a compact format for representing patterns in cellular automata.
 *
 * ## Reference
 * - [apgcode | LifeWiki](https://conwaylife.com/wiki/Apgcode)
 */
export type Apgcode =
  | ApgcodeStillLife
  | ApgcodeOscillator
  | ApgcodeSpaceship
  | ApgcodeLinear;
