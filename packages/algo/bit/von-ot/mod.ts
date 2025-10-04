// deno-lint-ignore-file camelcase

/**
 * Sorts 4 bitwise inputs (a, b, c, d) using a 4-input sorting network
 * The result is an array [R0, R1, R2, R3] where:
 * R0 = min(a, b, c, d)
 * R3 = max(a, b, c, d)
 */
export function sort4(a: number, b: number, c: number, d: number) {
  // Stage 1: Sort pairs (a, b) and (c, d)
  const ap = a & b; // a' = min(a, b)
  const bp = a | b; // b' = max(a, b)

  const cp = c & d; // c' = min(c, d)
  const dp = c | d; // d' = max(c, d)

  // Stage 2: Sort (a', c') and (b', d')
  const R0 = ap & cp; // R0: min(a', c') -> count >= 4 (All 1s)
  const cpp = ap | cp; // Max(a', c')

  const bpp = bp & dp; // Min(b', d')
  const R3 = bp | dp; // R3: max(b', d') -> count >= 1 (At least one 1)

  // Stage 3: Sort the middle two (bpp, cpp)
  // These are the two middle elements that need to be compared and swapped if necessary.
  const R1 = bpp & cpp; // Final R1: count >= 3
  const R2 = bpp | cpp; // Final R2: count >= 2

  // Returns [R0, R1, R2, R3] sorted from smallest (R0) to largest (R3)
  return [R0, R1, R2, R3];
}

/**
 * Creates a function to calculate the next state of a cell (row) in a
 * von Neumann totalistic cellular automaton. This function is generalized
 * for any 4-neighbor totalistic rule.
 *
 * It uses an inlined 4-input sorting network (Batcher's network) to calculate
 * neighbor counts (0-4) and applies the totalistic birth/survival rules.
 *
 * @param transition The totalistic rule (e.g., { birth: [1], survive: [2] })
 * @returns A function that takes the 4 neighbor rows and the center row, and returns the next center row.
 */
function createVonNeumannTotalisticNextCellCount(
  transition: { birth: number[]; survive: number[] },
) {
  const birth = transition.birth;
  const survive = transition.survive;

  if (birth.some((x) => x > 4) || survive.some((x) => x > 4)) {
    throw new Error("count should be less than 5 for von Neumann neighborhood");
  }

  // Pre-calculate bitmasks for rules B0 to B4
  // We only need up to 4 neighbors for von Neumann
  const birth0 = birth.includes(0) ? 0xffffffff : 0;
  const birth1 = birth.includes(1) ? 0xffffffff : 0;
  const birth2 = birth.includes(2) ? 0xffffffff : 0;
  const birth3 = birth.includes(3) ? 0xffffffff : 0;
  const birth4 = birth.includes(4) ? 0xffffffff : 0;

  // Pre-calculate bitmasks for rules S0 to S4
  const survive0 = survive.includes(0) ? 0xffffffff : 0;
  const survive1 = survive.includes(1) ? 0xffffffff : 0;
  const survive2 = survive.includes(2) ? 0xffffffff : 0;
  const survive3 = survive.includes(3) ? 0xffffffff : 0;
  const survive4 = survive.includes(4) ? 0xffffffff : 0;

  // The 4 neighbors: North (n), East (e), South (s), West (w)
  return function nextCell(
    n: number,
    e: number,
    s: number,
    w: number,
    prevCenter: number,
  ) {
    // ----------------------------------------------------------------------
    // INLINED 4-INPUT BITWISE SORTING NETWORK (Batcher's odd-even merge sort)
    // Inputs: n, e, s, w
    // Outputs: V4, V3, V2, V1 (where V_i means count >= i)
    // ----------------------------------------------------------------------

    // Stage 1: Sort pairs (n, s) and (e, w)
    const ns_min = n & s;
    const ns_max = n | s;

    const ew_min = e & w;
    const ew_max = e | w;

    // Stage 2: Sort (ns_min, ew_min) and (ns_max, ew_max)
    const V4 = ns_min & ew_min; // R0: count >= 4 (All 1s)
    const middle_upper = ns_min | ew_min;

    const middle_lower = ns_max & ew_max;
    const V1 = ns_max | ew_max; // R3: count >= 1 (At least one 1)

    // Stage 3: Sort the middle two (middle_lower, middle_upper)
    const V3 = middle_lower & middle_upper; // R1: count >= 3
    const V2 = middle_lower | middle_upper; // R2: count >= 2

    // ----------------------------------------------------------------------
    // END SORTING NETWORK
    // ----------------------------------------------------------------------

    // Derive the exact neighbor count masks: Count i = V_i & (~V_{i+1})
    // Note: V_5 is effectively 0, so count4 = V4 & (~V5) = V4
    const count0 = ~V1; // exactly 0 neighbors
    const count1 = V1 & (~V2); // exactly 1 neighbor
    const count2 = V2 & (~V3); // exactly 2 neighbors
    const count3 = V3 & (~V4); // exactly 3 neighbors
    const count4 = V4; // exactly 4 neighbors

    // Apply the birth rule (when the current cell is dead: ~prevCenter)
    const birthRule = (count0 & birth0) |
      (count1 & birth1) |
      (count2 & birth2) |
      (count3 & birth3) |
      (count4 & birth4);

    // Apply the survival rule (when the current cell is alive: prevCenter)
    const survivalRule = (count4 & survive4) |
      (count3 & survive3) |
      (count2 & survive2) |
      (count1 & survive1) |
      (count0 & survive0);

    // Determine the next state of the center cells
    const nextCenterState =
      // Dead cell revives if birth rule is met
      ((~prevCenter) & birthRule) |
      // Alive cell survives if survival rule is met
      (prevCenter & survivalRule);

    return nextCenterState;
  };
}

/**
 * Creates the main function to calculate the next state of a row (center)
 * in a von Neumann CA, given the center row, and the four cardinal neighbor rows.
 *
 * @param transition The totalistic rule (e.g., { birth: [1], survive: [2] })
 * @returns A function that takes 5 row inputs (center, N, E_wrap, S, W_wrap) and returns the next center row.
 */
export function createVonNeumannNextCell(
  transition: { birth: number[]; survive: number[] },
) {
  const nextTotalistic = createVonNeumannTotalisticNextCellCount(transition);

  const nextCell = (
    center: number, // The row being calculated
    n: number, // North row (row above)
    e: number, // Row used for East wrap-around
    s: number, // South row (row below)
    w: number, // Row used for West wrap-around
  ) => {
    // Calculate the actual East neighbor row (center shifted right, with wrap-around)
    // The neighbor to the East of bit 'i' is bit 'i-1' of the center, plus bit 31 of row 'e'
    const e1 = center >>> 1 | (e & 0x00000001) << 31;
    // Calculate the actual West neighbor row (center shifted left, with wrap-around)
    // The neighbor to the West of bit 'i' is bit 'i+1' of the center, plus bit 0 of row 'w'
    const w1 = center << 1 | (w & 0x80000000) >>> 31;

    // Optimization: If the center and all effective neighbors are zero, the result is zero.
    if (n === 0 && s === 0 && e1 === 0 && w1 === 0 && center === 0) {
      return 0;
    }

    // Pass N (n), E (e1), S (s), W (w1) as the 4 neighbor rows to the totalistic counter.
    return nextTotalistic(n, e1, s, w1, center);
  };
  return nextCell;
}
