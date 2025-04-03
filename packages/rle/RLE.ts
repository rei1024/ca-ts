import type { CACell } from "@ca-ts/pattern";
export type { CACell };

/**
 * Run Length Encoded file format
 *
 * ## Reference
 * - [Run Length Encoded | LifeWiki](https://conwaylife.com/wiki/Run_Length_Encoded)
 * - [Extended RLE format | Golly Help](https://golly.sourceforge.io/Help/formats.html#rle)
 */
export type RLE = {
  /**
   * Cells
   *
   * Must be sorted lexicographically on (y, x)
   *
   * Example: `[{ position: { x: 2, y: 0 }, state: 1 }]`
   */
  cells: CACell[];
  /**
   * Comments in the RLE file
   *
   * Each comment line includes '#'
   *
   * May contain spaces before '#'
   *
   * Example: `['#C Comment', '   #C Comment 2']`
   */
  comments: string[];
  /**
   * Trailing comment after '!'
   *
   * May include "\n"
   *
   * Example: `"This is a trailing comment\n"`
   */
  trailingComment: string;
  /**
   * Rule string specifying the rules of the cellular automaton
   *
   * Example: `'B3/S23'`
   */
  ruleString: string;
  /**
   * Size of the grid
   *
   * Format: "x = ..., y = ..."
   *
   * Example: `{ width: 10, height: 20 }`
   */
  size: {
    /** Width of the grid (x) */
    width: number;
    /** Height of the grid (y) */
    height: number;
  } | null;
  /**
   * Extended RLE Format
   *
   * Example: "#CXRLE Pos=0,-1377 Gen=34801"
   */
  XRLE: {
    /**
     * Position in the extended RLE format
     *
     * Example: `{ x: 0, y: -1377 }`
     */
    position: {
      x: number;
      y: number;
    } | null;
    /**
     * Generation in the extended RLE format
     *
     * Example: `"34801"`
     */
    generation: string | null;
  } | null;
};
