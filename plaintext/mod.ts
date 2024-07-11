/**
 * Plaintext file format parser and writer
 *
 * ## Example
 * ```ts
 * import { parsePlaintext } from "@ca-ts/plaintext"
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   parsePlaintext(`!Name: Glider
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
export { parsePlaintext } from "./parsePlaintext.ts";
export { stringifyPlaintext } from "./stringifyPlaintext.ts";
