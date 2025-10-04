// [Proving 50-Year-Old Sorting Networks Optimal: Part 1 - Jannis](https://jix.one/proving-50-year-old-sorting-networks-optimal-part-1/)
// [Conway’s Game of Life in Logic Gates - Dietrich Epp](https://www.moria.us/old/3/programs/life/)

/*
     & |
0 0  0 0
0 1  0 1
1 0  0 1
1 1  1 1
*/

/**
 * Sort bitwise
 */
export function sort8(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
  h: number,
) {
  const ab0 = a & b; // Upper
  const ab1 = a | b; // Lower

  const cd0 = c & d;
  const cd1 = c | d;

  const ef0 = e & f;
  const ef1 = e | f;

  const gh0 = g & h;
  const gh1 = g | h;

  const abcd0 = ab0 & cd0;
  const abcd1_ = ab0 | cd0;
  const abcd2_ = ab1 & cd1;
  const abcd3 = ab1 | cd1;

  const abcd1 = abcd1_ & abcd2_;
  const abcd2 = abcd1_ | abcd2_;

  const efgh0 = ef0 & gh0;
  const efgh1_ = ef0 | gh0;
  const efgh2_ = ef1 & gh1;
  const efgh3 = ef1 | gh1;

  const efgh1 = efgh1_ & efgh2_;
  const efgh2 = efgh1_ | efgh2_;

  // merge
  const m0 = abcd0 & efgh0;
  const m1 = abcd0 | efgh0;

  const m2 = abcd1 & efgh1;
  const m3 = abcd1 | efgh1;

  const m4 = abcd2 & efgh2;
  const m5 = abcd2 | efgh2;

  const m6 = abcd3 & efgh3;
  const m7 = abcd3 | efgh3;

  const n1 = m1 & m2;
  const n2 = m1 | m2;
  const n5 = m5 & m6;
  const n6 = m5 | m6;

  const o2 = n2 & m4;
  const o3 = n2 | m4;
  const o4 = m3 & n5;
  const o5 = m3 | n5;

  const p3 = o3 & o4;
  const p4 = o3 | o4;

  return [m0, n1, o2, p3, p4, o5, n6, m7];
  // return { m0, n1, o2, p3, p4, o5, n6, m7 };
}

function createTotalisticNextCellCount(
  transition: { birth: number[]; survive: number[] },
) {
  const birth = transition.birth;
  const birth0 = birth.includes(0) ? 0xffffffff : 0;

  if (birth0 !== 0) {
    throw new Error("B0 rule");
  }

  const birth1 = birth.includes(1) ? 0xffffffff : 0;
  const birth2 = birth.includes(2) ? 0xffffffff : 0;
  const birth3 = birth.includes(3) ? 0xffffffff : 0;
  const birth4 = birth.includes(4) ? 0xffffffff : 0;
  const birth5 = birth.includes(5) ? 0xffffffff : 0;
  const birth6 = birth.includes(6) ? 0xffffffff : 0;
  const birth7 = birth.includes(7) ? 0xffffffff : 0;
  const birth8 = birth.includes(8) ? 0xffffffff : 0;

  const survive = transition.survive;
  const survive0 = survive.includes(0) ? 0xffffffff : 0;
  const survive1 = survive.includes(1) ? 0xffffffff : 0;
  const survive2 = survive.includes(2) ? 0xffffffff : 0;
  const survive3 = survive.includes(3) ? 0xffffffff : 0;
  const survive4 = survive.includes(4) ? 0xffffffff : 0;
  const survive5 = survive.includes(5) ? 0xffffffff : 0;
  const survive6 = survive.includes(6) ? 0xffffffff : 0;
  const survive7 = survive.includes(7) ? 0xffffffff : 0;
  const survive8 = survive.includes(8) ? 0xffffffff : 0;

  return function nextCell(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    prevCenter: number,
  ) {
    const ab0 = a & b; // Upper
    const ab1 = a | b; // Lower

    const cd0 = c & d;
    const cd1 = c | d;

    const ef0 = e & f;
    const ef1 = e | f;

    const gh0 = g & h;
    const gh1 = g | h;

    const abcd0 = ab0 & cd0;
    const abcd1_ = ab0 | cd0;
    const abcd2_ = ab1 & cd1;
    const abcd3 = ab1 | cd1;

    const abcd1 = abcd1_ & abcd2_;
    const abcd2 = abcd1_ | abcd2_;

    const efgh0 = ef0 & gh0;
    const efgh1_ = ef0 | gh0;
    const efgh2_ = ef1 & gh1;
    const efgh3 = ef1 | gh1;

    const efgh1 = efgh1_ & efgh2_;
    const efgh2 = efgh1_ | efgh2_;

    // merge
    const m0 = abcd0 & efgh0;
    const m1 = abcd0 | efgh0;

    const m2 = abcd1 & efgh1;
    const m3 = abcd1 | efgh1;

    const m4 = abcd2 & efgh2;
    const m5 = abcd2 | efgh2;

    const m6 = abcd3 & efgh3;
    const m7 = abcd3 | efgh3;

    const n1 = m1 & m2;
    const n2 = m1 | m2;
    const n5 = m5 & m6;
    const n6 = m5 | m6;

    const o2 = n2 & m4;
    const o3 = n2 | m4;
    const o4 = m3 & n5;
    const o5 = m3 | n5;

    const p3 = o3 & o4;
    const p4 = o3 | o4;

    // alive neighbor count is less than or equal to zero
    const sort1 = m7;
    // alive neighbor count is less than or equal to one
    const sort2 = n6;
    const sort3 = o5;
    const sort4 = p4;
    const sort5 = p3;
    const sort6 = o2;
    const sort7 = n1;
    const sort8 = m0;

    // alive neighbor count is zero
    const count0 = ~sort1;
    // alive neighbor count is one
    const count1 = sort1 & (~sort2);
    const count2 = sort2 & (~sort3);
    const count3 = sort3 & (~sort4);
    const count4 = sort4 & (~sort5);
    const count5 = sort5 & (~sort6);
    const count6 = sort6 & (~sort7);
    const count7 = sort7 & (~sort8);
    const count8 = sort8;

    // Apply the birth rule (when the current cell is dead)
    const birthRule = (count1 & birth1) |
      (count2 & birth2) |
      (count3 & birth3) |
      (count4 & birth4) |
      (count5 & birth5) |
      (count6 & birth6) |
      (count7 & birth7) |
      (count8 & birth8);

    // Apply the survival rule (when the current cell is alive)
    const survivalRule = (count8 & survive8) |
      (count7 & survive7) |
      (count6 & survive6) |
      (count5 & survive5) |
      (count4 & survive4) |
      (count3 & survive3) |
      (count2 & survive2) |
      (count1 & survive1) |
      (count0 & survive0);

    // Determine the next state of the center cells
    const nextCenterState =
      // If the current cell is dead, apply the birth rule
      ((~prevCenter) & birthRule) |
      // If the current cell is alive, apply the survival rule
      (prevCenter & survivalRule);

    return nextCenterState;
  };
}

const nextConway = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
  h: number,
  prev: number,
) => {
  const ab0 = a & b; // Upper
  const ab1 = a | b; // Lower

  const cd0 = c & d;
  const cd1 = c | d;

  const ef0 = e & f;
  const ef1 = e | f;

  const gh0 = g & h;
  const gh1 = g | h;

  const abcd0 = ab0 & cd0;
  const abcd1_ = ab0 | cd0;
  const abcd2_ = ab1 & cd1;
  const abcd3 = ab1 | cd1;

  const abcd1 = abcd1_ & abcd2_;
  const abcd2 = abcd1_ | abcd2_;

  const efgh0 = ef0 & gh0;
  const efgh1_ = ef0 | gh0;
  const efgh2_ = ef1 & gh1;
  const efgh3 = ef1 | gh1;

  const efgh1 = efgh1_ & efgh2_;
  const efgh2 = efgh1_ | efgh2_;

  // merge
  const m1 = abcd0 | efgh0;

  const m2 = abcd1 & efgh1;
  const m3 = abcd1 | efgh1;

  const m4 = abcd2 & efgh2;
  const m5 = abcd2 | efgh2;

  const m6 = abcd3 & efgh3;

  const n2 = m1 | m2;
  const n5 = m5 & m6;
  const gte2 = m5 | m6;

  const o3 = n2 | m4;
  const o4 = m3 & n5;
  const gte3 = m3 | n5;

  const gte4 = o3 | o4;

  return ((prev & gte2) | gte3) & (~gte4);
};

/**
 * ne n nw
 *  e c  w
 * se s sw
 */

// function print(name: string, n: number) {
//   console.log(name, n.toString(2).padStart(32, "0"));
// }

/**
 * Rule of Conway's Game of Life
 *
 * bitwise
 */
export const nextCellConway = (
  center: number,
  ne: number,
  n: number,
  nw: number,
  e: number,
  w: number,
  se: number,
  s: number,
  sw: number,
) => {
  const ne1 = n >>> 1 | (ne & 0x00000001) << 31;
  const nw1 = n << 1 | (nw & 0x80000000) >>> 31;

  const e1 = center >>> 1 | (e & 0x00000001) << 31;
  const w1 = center << 1 | (w & 0x80000000) >>> 31;

  const se1 = s >>> 1 | (se & 0x00000001) << 31;
  const sw1 = s << 1 | (sw & 0x80000000) >>> 31;

  // optimize
  if (
    n === 0 && s === 0 && ne1 === 0 && nw1 === 0 && e1 === 0 && w1 === 0 &&
    se1 === 0 && sw1 === 0 && center === 0
  ) {
    return 0;
  }
  return nextConway(n, s, ne1, nw1, e1, w1, se1, sw1, center);
};

export function createTotalisticNextCell(
  transition: { birth: number[]; survive: number[] },
) {
  const nextTotalistic = createTotalisticNextCellCount(transition);
  const nextCell = (
    center: number,
    ne: number,
    n: number,
    nw: number,
    e: number,
    w: number,
    se: number,
    s: number,
    sw: number,
  ) => {
    const ne1 = n >>> 1 | (ne & 0x00000001) << 31;
    const nw1 = n << 1 | (nw & 0x80000000) >>> 31;

    const e1 = center >>> 1 | (e & 0x00000001) << 31;
    const w1 = center << 1 | (w & 0x80000000) >>> 31;

    const se1 = s >>> 1 | (se & 0x00000001) << 31;
    const sw1 = s << 1 | (sw & 0x80000000) >>> 31;

    // optimize
    if (
      n === 0 && s === 0 && ne1 === 0 && nw1 === 0 && e1 === 0 && w1 === 0 &&
      se1 === 0 && sw1 === 0 && center === 0
    ) {
      return 0;
    }
    return nextTotalistic(n, s, ne1, nw1, e1, w1, se1, sw1, center);
  };
  return nextCell;
}

// [Bit Twiddling Hacks By Sean Eron Anderson](https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetNaive:~:text=counting%20bits%20in%20a%2032%2Dbit%20integer)
/**
 * count bits
 * @param n n >= 0
 * @returns number of 1s
 */
export function bitCount(n: number) {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

export function bitCountArrayBuffer(buffer: ArrayBufferLike) {
  let sum = 0;
  const array = new Uint32Array(buffer);
  for (const n of array) {
    sum += bitCount(n);
  }
  return sum;
}

/**
 * a = a | b
 */
export function bitOrUint32Array(a: Uint32Array, b: Uint32Array) {
  const aLen = a.length;
  if (aLen !== b.length) {
    throw Error("bitOrUint32Array different length");
  }

  for (let i = 0; i < aLen; i++) {
    a[i] = a[i]! | b[i]!;
  }
}

/**
 * a = a & b
 */
export function bitAndUint32Array(a: Uint32Array, b: Uint32Array) {
  const aLen = a.length;
  if (aLen !== b.length) {
    throw Error("bitAndUint32Array different length");
  }

  for (let i = 0; i < aLen; i++) {
    a[i] = a[i]! & b[i]!;
  }
}

/**
 * Count Trailing Zeros (ctrz) utility.
 * Calculates the number of trailing zero bits in a 32-bit integer.
 * * @param integer - The 32-bit unsigned integer value.
 * @returns The number of trailing zero bits (0 to 32).
 */
export const ctrz = (integer: number): number => {
  // If integer is 0, all bits are zero, so return 32.
  if (integer === 0) {
    return 32;
  }
  // Isolate the LSB (Least Significant Bit) and calculate the distance from the MSB (clz32)
  // which corresponds to the number of trailing zeros.
  return 31 - Math.clz32(integer & -integer);
};
