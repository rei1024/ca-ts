/**
 * apgcode parser
 *
 * ## Example
 * ```ts
 * import { parseApgcode } from "./mod.ts"
 *
 * const parsedCode = parseApgcode("xs4_33");
 * ```
 *
 * ## Reference
 * - [apgcode | LifeWiki](https://conwaylife.com/wiki/Apgcode)
 *
 * @module
 */

export type { Apgcode } from "./Apgcode.ts";
export { parseApgcode, parseExtendedWechslerFormat } from "./parseApgcode.ts";
