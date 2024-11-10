import { intConditionArray } from "../../internal/intConditionArray.ts";

export function crateINTNextCell(
  transition: { birth: string[]; survive: string[] },
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
    return createINTNextCellNormalized(transition)(
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

function createINTNextCellNormalized(
  transition: { birth: string[]; survive: string[] },
) {
  const birth = transition.birth;
  const birth0 = birth.includes("0") ? 0xffffffff : 0;

  if (birth0 !== 0) {
    throw new Error("B0 rule");
  }

  const lookupTableBirth = Array(256).fill(0).map((_, i) =>
    birth.includes(intConditionArray[i] ?? "") ? 1 : 0
  );

  const lookupTableSurvive = Array(256).fill(0).map((_, i) =>
    transition.survive.includes(intConditionArray[i] ?? "") ? 1 : 0
  );

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
    let result = 0;
    for (let u = 0; u < 32; u++) {
      const shift = 31 - u;
      const mask = 1 << shift;
      const a_ = (a & mask) >>> shift;
      const b_ = ((b & mask) >>> shift) << 1;
      const c_ = ((c & mask) >>> shift) << 2;
      const d_ = ((d & mask) >>> shift) << 3;
      const e_ = ((e & mask) >>> shift) << 4;
      const f_ = ((f & mask) >>> shift) << 5;
      const g_ = ((g & mask) >>> shift) << 6;
      const h_ = ((h & mask) >>> shift) << 7;
      const center_ = (prevCenter & mask) !== 0;
      result = result << 1 |
        ((center_ ? lookupTableSurvive : lookupTableBirth)[
          a_ | b_ | c_ | d_ | e_ | f_ | g_ | h_
        ]!);
    }
    return result;
  };
}
