/**
 * MAP rule
 */
export function createMAPNextCell(
  data: (0 | 1)[],
): (
  center: number,
  ne: number,
  n: number,
  nw: number,
  e: number,
  w: number,
  se: number,
  s: number,
  sw: number,
) => number {
  if (data.length !== 512) {
    throw new Error("data should have 512 bits");
  }

  const nextCellNormalized = createMAPNextCellNormalized(data);
  return function nextCell(
    center: number,
    ne: number,
    n: number,
    nw: number,
    e: number,
    w: number,
    se: number,
    s: number,
    sw: number,
  ) {
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
    return nextCellNormalized(
      nw1,
      n,
      ne1,
      w1,
      e1,
      sw1,
      s,
      se1,
      center,
    );
  };
}

function createMAPNextCellNormalized(
  data: (0 | 1)[],
) {
  const uint8Array = new Uint8Array(data);

  /**
   * ```txt
   * ne n nw
   * e  c  w
   * se s sw
   * ```
   */
  return function nextCell(
    nw1: number,
    n: number,
    ne1: number,
    w1: number,
    e1: number,
    sw1: number,
    s: number,
    se1: number,
    center: number,
  ) {
    let result = 0;
    for (let u = 0; u < 32; u++) {
      const shift = 31 - u;
      const mask = 1 << shift;
      const sw_ = (sw1 & mask) >>> shift;
      const s_ = ((s & mask) >>> shift) << 1;
      const se_ = ((se1 & mask) >>> shift) << 2;
      const w_ = ((w1 & mask) >>> shift) << 3;
      const c_ = ((center & mask) >>> shift) << 4;
      const e_ = ((e1 & mask) >>> shift) << 5;
      const nw_ = ((nw1 & mask) >>> shift) << 6;
      const n_ = ((n & mask) >>> shift) << 7;
      const ne_ = ((ne1 & mask) >>> shift) << 8;

      const index = sw_ | s_ | se_ | w_ | c_ | e_ | nw_ | n_ | ne_;
      result = result << 1 | uint8Array[index]!;
    }
    return result;
  };
}
