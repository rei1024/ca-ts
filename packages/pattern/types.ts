/**
 * A cell of cellular automaton
 */
export type CACell = {
  /** Position of the cell */
  readonly position: {
    /**
     * x coordinate
     */
    readonly x: number;
    /**
     * y coordinate
     */
    readonly y: number;
  };
  /**
   * State of the cell
   *
   * 0 is the background state
   */
  readonly state: number;
};
