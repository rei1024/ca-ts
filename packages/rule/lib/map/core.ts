import type { GridParameter } from "../grid/mod.ts";

/**
 * MAP strings
 *
 * [Non-isotropic rule](https://conwaylife.com/wiki/Non-isotropic_rule)
 */
export type MAPRule = {
  type: "map";
  /**
   * - Moore neighborhood: 512 bits
   * - Hexagonal neighborhood: 128 bits
   * - Von Neumann neighborhood: 32 bits
   */
  data: (0 | 1)[];
  /**
   * - "moore": Moore neighborhood
   * - "hexagonal": Hexagonal neighborhood
   * - "von-neumann": Von Neumann neighborhood
   */
  neighbors: "moore" | "hexagonal" | "von-neumann";
  /**
   * [Bounded grids | GollyHelp](https://golly.sourceforge.io/Help/bounded.html)
   */
  gridParameter?: GridParameter;
};
