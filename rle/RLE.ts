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
   */
  cells: CACell[];
  /**
   * includes '#'
   *
   * may contains space before '#'
   * @example ['#C Comment', '   #C Comment 2']
   */
  comments: string[];
  /**
   * after !
   *
   * maybe include "\n"
   */
  trailingComment: string;
  /**
   * "rule = ..."
   * @example 'B3/S23'
   */
  ruleString: string;
  /**
   * "x = ..., y = ..."
   */
  size: {
    width: number;
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

export type CACell = {
  /**
   * x coordinate
   */
  x: number;
  /**
   * y coordinate
   */
  y: number;
  /**
   * State of the cell (non zero)
   *
   * 1, 2, ...
   * @example 1
   */
  state: number;
};
