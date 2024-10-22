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
    return createINTNextCellCount(transition)(
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

const intConditionArray: string[] =
  `0 1c 1e 2a 1c 2c 2a 3i 1e 2a 2e 3a 2k 3n 3j 4a 1e 2k 2e 3j 2a 3n 3a 4a 2i 3r 3e 4r 3r 4i 4r 5i 1c 2c 2k 3n 2n 3c 3q 4n 2a 3i 3j 4a 3q 4n 4w 5a 2k 3y 3k 4k 3q 4y 4q 5j 3r 4t 4j 5n 4z 5r 5q 6a 1e 2k 2i 3r 2k 3y 3r 4t 2e 3j 3e 4r 3k 4k 4j 5n 2e 3k 3e 4j 3j 4k 4r 5n 3e 4j 4e 5c 4j 5y 5c 6c 2a 3n 3r 4i 3q 4y 4z 5r 3a 4a 4r 5i 4q 5j 5q 6a 3j 4k 4j 5y 4w 5k 5q 6k 4r 5n 5c 6c 5q 6k 6n 7c 1c 2n 2k 3q 2c 3c 3n 4n 2k 3q 3k 4q 3y 4y 4k 5j 2a 3q 3j 4w 3i 4n 4a 5a 3r 4z 4j 5q 4t 5r 5n 6a 2c 3c 3y 4y 3c 4c 4y 5e 3n 4n 4k 5j 4y 5e 5k 6e 3n 4y 4k 5k 4n 5e 5j 6e 4i 5r 5y 6k 5r 6i 6k 7e 2a 3q 3r 4z 3n 4y 4i 5r 3j 4w 4j 5q 4k 5k 5y 6k 3a 4q 4r 5q 4a 5j 5i 6a 4r 5q 5c 6n 5n 6k 6c 7c 3i 4n 4t 5r 4n 5e 5r 6i 4a 5a 5n 6a 5j 6e 6k 7e 4a 5j 5n 6k 5a 6e 6a 7e 5i 6a 6c 7c 6a 7e 7c 8`
    .trim()
    .split(/\s+/);

function createINTNextCellCount(
  transition: { birth: string[]; survive: string[] },
) {
  const birth = transition.birth;
  const birth0 = birth.includes("0") ? 0xffffffff : 0;

  if (birth0 !== 0) {
    throw new Error("B0 rule");
  }

  const lookupTableBirth = Array(256).fill(0).map((_, i) =>
    birth.includes(intConditionArray[i] ?? "")
  );

  const lookupTableSurvive = Array(256).fill(0).map((_, i) =>
    transition.survive.includes(intConditionArray[i] ?? "")
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
      const mask = 1 << (31 - u);
      const a_ = (a & mask) !== 0 ? 1 : 0;
      const b_ = (b & mask) !== 0 ? 2 : 0;
      const c_ = (c & mask) !== 0 ? 4 : 0;
      const d_ = (d & mask) !== 0 ? 8 : 0;
      const e_ = (e & mask) !== 0 ? 16 : 0;
      const f_ = (f & mask) !== 0 ? 32 : 0;
      const g_ = (g & mask) !== 0 ? 64 : 0;
      const h_ = (h & mask) !== 0 ? 128 : 0;
      const center_ = (prevCenter & mask) !== 0 ? 1 : 0;
      result = result << 1 |
        ((center_ === 0 ? lookupTableBirth : lookupTableSurvive)[
            a_ + b_ + c_ + d_ + e_ + f_ + g_ + h_
          ]
          ? 1
          : 0);
    }
    return result;
  };
}
