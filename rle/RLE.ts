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
   * includes '#'
   *
   * may contains space before '#'
   *
   * Example: `['#C Comment', '   #C Comment 2']`
   */
  comments: string[];
  /**
   * after !
   *
   * may include "\n"
   */
  trailingComment: string;
  /**
   * "rule = ..."
   *
   * Example: 'B3/S23'
   */
  ruleString: string;
  /**
   * "x = ..., y = ..."
   */
  size: {
    /** x */
    width: number;
    /** y */
    height: number;
  } | null;
  /**
   * Extended RLE Format
   * "#CXRLE Pos=0,-1377 Gen=34801"
   */
  XRLE: {
    /**
     * `Pos`
     */
    position: {
      x: number;
      y: number;
    } | null;
    /**
     * `Gen`
     */
    generation: string | null;
  } | null;
};

/**
 * A cell of cellular automaton
 */
export type CACell = {
  /** Position of the cell */
  position: {
    /**
     * x coordinate
     * `>= 0`
     */
    x: number;
    /**
     * y coordinate
     * `>= 0`
     */
    y: number;
  };
  /**
   * State of the cell (non zero)
   *
   * 1..255 (inclusive)
   */
  state: number;
};
