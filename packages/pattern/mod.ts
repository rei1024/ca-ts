/**
 * This module provides a set of utilities for working with cellular automata (CA) patterns.
 *
 * @example
 * ```ts
 * import { CACellList } from "@ca-ts/pattern";
 * import { assertEquals } from "@std/assert";
 *
 * const cellList = CACellList.fromCells([
 *  { position: { x: 0, y: 0 }, state: 1 },
 *  { position: { x: 1, y: 0 }, state: 2 },
 *  { position: { x: 2, y: 0 }, state: 3 },
 * ]);
 * const array = cellList.to2dArray();
 *
 * assertEquals(array, {
 *   array: [
 *     [1, 2, 3],
 *   ],
 *   size: { width: 3, height: 1 },
 *   offset: { dx: 0, dy: 0 },
 * });
 * ```
 *
 * @module
 */
export type { CACell, Position } from "./types.ts";
export { CACellList } from "./ca-cell-list.ts";
export { BoundingRect } from "./bounding-rect.ts";
