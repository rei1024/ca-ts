// https://jix.one/proving-50-year-old-sorting-networks-optimal-part-1/
// [Conway’s Game of Life in Logic Gates - Dietrich Epp](https://www.moria.us/old/3/programs/life/)

/*
     & |
0 0  0 0
0 1  0 1
1 0  0 1
1 1  1 1
*/

export function sort(
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

const next = (
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

export const nextCell = (
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
  return next(n, s, ne1, nw1, e1, w1, se1, sw1, center);
};

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

export function bitCountArrayBuffer(buffer: ArrayBuffer) {
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
  if (a.length !== b.length) {
    throw Error("bitOrUint32Array different length");
  }

  const len = a.length;

  for (let i = 0; i < len; i++) {
    a[i] = a[i]! | b[i]!;
  }
}

/**
 * a = a & b
 */
export function bitAndUint32Array(a: Uint32Array, b: Uint32Array) {
  if (a.length !== b.length) {
    throw Error("bitAndUint32Array different length");
  }

  const len = a.length;

  for (let i = 0; i < len; i++) {
    a[i] = a[i]! & b[i]!;
  }
}
