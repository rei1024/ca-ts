/**
 * apgcode parser.
 *
 * An apgcode is a unique identifier for a pattern in cellular automata, such as Conway's Game of Life.
 * See [apgcode](https://conwaylife.com/wiki/Apgcode) for more information.
 *
 * ## Example
 * Parsing an apgcode string:
 * ```ts
 * import { parseApgcode } from "@ca-ts/apgcode";
 * import { assertEquals } from "@std/assert";
 *
 * const parsedCode = parseApgcode("xs4_33");
 * assertEquals(parsedCode, {
 *   type: "still-life",
 *   population: 4,
 *   cells: [
 *     { x: 0, y: 0 },
 *     { x: 1, y: 0 },
 *     { x: 0, y: 1 },
 *     { x: 1, y: 1 },
 *   ],
 * });
 * ```
 *
 * Stringifying an apgcode object:
 * ```ts
 * import { stringifyApgcode } from "@ca-ts/apgcode";
 * import { assertEquals } from "@std/assert";
 *
 * const apgcodeObject = {
 *   type: "still-life" as const,
 *   population: 4,
 *   cells: [
 *    { x: 0, y: 0 },
 *    { x: 1, y: 0 },
 *    { x: 0, y: 1 },
 *    { x: 1, y: 1 },
 *  ],
 * };
 *
 * const apgcodeString = stringifyApgcode(apgcodeObject);
 * assertEquals(apgcodeString, "xs4_33");
 * ```
 *
 * @module
 */

export type {
  Apgcode,
  ApgcodeLinear,
  ApgcodeOscillator,
  ApgcodeSpaceship,
  ApgcodeStillLife,
} from "./Apgcode.ts";
export {
  ApgcodeParseError,
  parseApgcode,
  parseExtendedWechslerFormat,
} from "./parseApgcode.ts";
export {
  stringifyApgcode,
  stringifyExtendedWechslerFormat,
} from "./stringifyApgcode.ts";
