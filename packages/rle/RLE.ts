import type { CACell } from "@ca-ts/pattern";
export type { CACell };

/**
 * Run Length Encoded (RLE) file format
 *
 * ## Reference
 * - [Run Length Encoded | LifeWiki](https://conwaylife.com/wiki/Run_Length_Encoded)
 * - [Extended RLE format | Golly Help](https://golly.sourceforge.io/Help/formats.html#rle)
 */
export type RLE = {
  /**
   * Cells in the pattern without background state
   *
   * Must be sorted lexicographically by (y, x).
   *
   * Example: `[{ position: { x: 2, y: 0 }, state: 1 }]`
   */
  cells: CACell[];
  /**
   * Rule string specifying the rules of the cellular automaton.
   *
   * Example: `'B3/S23'`
   */
  ruleString: string;
  /**
   * Size of the pattern
   *
   * Format: "x = ..., y = ...".
   *
   * Example: `{ width: 10, height: 20 }`
   */
  size: {
    /** Width of the pattern. */
    width: number;
    /** Height of the pattern. */
    height: number;
  } | null;
  /**
   * Extended RLE Format extra information
   *
   * Example: "#CXRLE Pos=0,-1377 Gen=34801"
   */
  XRLE: {
    /**
     * absolute position of the upper left cell (which may be on or off)
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
  /**
   * Comments in the RLE file
   *
   * Each comment line starts with '#'.
   *
   * May include spaces before the '#'.
   *
   * Example: `['#C Comment', '   #C Comment 2']`
   */
  comments: string[];
  /**
   * Trailing comment after '!'
   *
   * May include "\n".
   *
   * Example: `"This is a trailing comment\n"`
   */
  trailingComment: string;
};
