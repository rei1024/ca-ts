/**
 * .rule file format
 *
 * ### Reference
 * - [RuleLoader | LifeWiki](https://conwaylife.com/wiki/RuleLoader)
 * - [Rule format | Golly Help](https://golly.sourceforge.io/Help/formats.html#rule)
 * - [RoadMap | Rule Table Repository](https://github.com/GollyGang/ruletablerepository/wiki/RoadMap)
 */
export type RuleFormat = {
  /**
   * The name of the rule.
   */
  name: string;
  /**
   * The description of the rule.
   */
  description: string[];
  /**
   * `@TABLE` section
   */
  table?: {
    lines: RuleTableLine[];
  };
  /**
   * Raw data from the rule file.
   */
  rawSections: Map<string, string[]>;
};

/**
 * A line in the `@TABLE` section of a rule file.
 */
export type RuleTableLine = {
  /**
   * Empty line
   */
  type: "empty";
} | {
  /**
   * Comment line
   */
  type: "comment";
  /**
   * includes `#`
   */
  comment: string;
} | {
  /**
   * Number of states for the rule.
   */
  type: "n_states";
  numberOfStates: number;
} | {
  /**
   * Neighborhood type for the rule.
   */
  type: "neighborhood";
  neighborhood: "vonNeumann" | "Moore" | "hexagonal";
} | {
  /**
   * Symmetries for the rule.
   */
  type: "symmetries";
  /**
   * @example "rotate4"
   */
  symmetries: string;
} | {
  /**
   * Variable definition for the rule.
   * @example "var a={0,1,2}"
   */
  type: "variable";
  variable: {
    name: string;
    values: string[];
  };
} | {
  type: "transition";
  transition: {
    condition: string[];
    to: string;
  };
};
