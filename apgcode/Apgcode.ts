/**
 * apgcode is a compact format for representing patterns in cellular automata.
 *
 * ## Reference
 * - [apgcode | LifeWiki](https://conwaylife.com/wiki/Apgcode)
 */
export type Apgcode = {
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
} | {
  /** `xp`, `xq` */
  type: "oscillator" | "spaceship";
  /** the period of the object */
  period: number;
  /**
   * pattern
   *
   * sorted lexicographically on (y, x)
   */
  cells: { x: number; y: number }[];
} | {
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
