/**
 * Plaintext file format
 *
 * ## Reference
 * - [Plaintext | LifeWiki](https://conwaylife.com/wiki/Plaintext)
 */
export type Plaintext = {
  /**
   * lines of description
   *
   * includes '!'
   */
  description: string[];
  /**
   * Two-dimensional array of states
   *
   * - 0: off
   * - 1: on
   */
  pattern: number[][];
  /**
   * Size of the pattern
   */
  size: {
    width: number;
    height: number;
  };
};
