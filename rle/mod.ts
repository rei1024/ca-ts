/**
 * Run Length Encoded (RLE) file format parser and writer
 *
 * RLE is a file format for storing cellular automaton patterns used by programs such as [Golly](https://golly.sourceforge.io/).
 *
 * ## Example
 * ```ts
 * import { parseRLE, stringifyRLE, type RLE } from "@ca-ts/rle";
 * import { assertEquals } from "@std/assert";
 *
 * const rle: RLE = parseRLE([`#N Glider`,
 * `#O Richard K. Guy`,
 * `#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.`,
 * `#C www.conwaylife.com/wiki/index.php?title=Glider`,
 * `x = 3, y = 3, rule = B3/S23`,
 * `bob$2bo$3o!`].join("\n"));
 * assertEquals(
 *   rle,
 *   {
 *     cells: [
 *       { position: { x: 1, y: 0 }, state: 1 },
 *       { position: { x: 2, y: 1 }, state: 1 },
 *       { position: { x: 0, y: 2 }, state: 1 },
 *       { position: { x: 1, y: 2 }, state: 1 },
 *       { position: { x: 2, y: 2 }, state: 1 },
 *     ],
 *     comments: [
 *       "#N Glider",
 *       "#O Richard K. Guy",
 *       "#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.",
 *       "#C www.conwaylife.com/wiki/index.php?title=Glider",
 *     ],
 *     trailingComment: "",
 *     ruleString: "B3/S23",
 *     size: {
 *       width: 3,
 *       height: 3,
 *     },
 *     XRLE: null,
 *   },
 * );
 *
 * assertEquals(
 *   stringifyRLE({
 *     cells: [
 *       { position: { x: 0, y: 0 }, state: 1 },
 *       { position: { x: 1, y: 0 }, state: 1 },
 *       { position: { x: 2, y: 0 }, state: 1 },
 *     ],
 *     comments: ["#N Blinker"],
 *     trailingComment: "",
 *     ruleString: "B3/S23",
 *     size: {
 *       width: 3,
 *       height: 1,
 *     },
 *     XRLE: null,
 *   }),
 *   `#N Blinker
 * x = 3, y = 1, rule = B3/S23
 * 3o!
 * `,
 * );
 * ```
 *
 * ## Reference
 * - [Run Length Encoded | LifeWiki](https://conwaylife.com/wiki/Run_Length_Encoded)
 * - [Extended RLE format | Golly Help](https://golly.sourceforge.io/Help/formats.html#rle)
 * @module
 */

export type { CACell, RLE } from "./RLE.ts";
export { parseRLE } from "./parseRLE.ts";
export { stringifyRLE, type StringifyRLEOptions } from "./stringifyRLE.ts";
export { cellsToArray } from "./lib/cellsToArray.ts";
