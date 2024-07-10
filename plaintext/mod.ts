/**
 * Plaintext file format parser and writer
 *
 * ## Example
 * ```ts
 * import { readPlaintext } from "@ca-ts/plaintext"
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   readPlaintext(`!Name: Glider
 * !
 * .O.
 * ..O
 * OOO`),
 *   {
 *     description: [
 *       "!Name: Glider",
 *       "!",
 *     ],
 *     pattern: [
 *       [0, 1, 0],
 *       [0, 0, 1],
 *       [1, 1, 1],
 *     ],
 *     size: {
 *       width: 3,
 *       height: 3,
 *     },
 *   },
 * );
 * ```
 *
 * ## Reference
 * - [Plaintext | LifeWiki](https://conwaylife.com/wiki/Plaintext)
 * @module
 */

export type { Plaintext } from "./Plaintext.ts";
export { readPlaintext } from "./readPlaintext.ts";
export { writePlaintext } from "./writePlaintext.ts";
