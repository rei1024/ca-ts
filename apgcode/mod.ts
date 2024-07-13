/**
 * apgcode parser
 *
 * ## Example
 * ```ts
 * import { parseApgcode } from "@ca-ts/apgcode";
 *
 * const parsedCode = parseApgcode("xs4_33");
 * ```
 *
 * ## Reference
 * - [apgcode | LifeWiki](https://conwaylife.com/wiki/Apgcode)
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
export { parseApgcode, parseExtendedWechslerFormat } from "./parseApgcode.ts";
