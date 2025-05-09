// C,N,NE,E,SE,S,SW,W,NW,C'
// 0,1,2, 3,4, 5, 6,7,8
/**
 * ```txt
 * 2 1 8
 * 3 0 7
 * 4 5 6
 *
 * ne n nw
 * e  c  w
 * se s sw
 *
 * ```
 */
const mooreBase = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const mooreRotate4List = [
  mooreBase,
  iterate(1, mooreRotateRight, mooreBase),
  iterate(2, mooreRotateRight, mooreBase),
  iterate(3, mooreRotateRight, mooreBase),
];

const symmetryMap = {
  Moore: {
    rotate4: mooreRotate4List,
    rotate4reflect: mooreRotate4List.concat(
      [
        mooreReflectHorizontal(mooreRotate4List[0] ?? internalError()),
        mooreReflectVertical(mooreRotate4List[1] ?? internalError()),
        mooreReflectHorizontal(mooreRotate4List[2] ?? internalError()),
        mooreReflectVertical(mooreRotate4List[3] ?? internalError()),
      ],
    ),
  },
};

function iterate<T>(n: number, f: (_: T) => T, a: T): T {
  for (let i = 0; i < n; i++) {
    a = f(a);
  }
  return a;
}

function mooreRotateRight(xs: number[]) {
  const rotated = [0, 3, 4, 5, 6, 7, 8, 1, 2];
  return applyIndices(xs, rotated);
}

function mooreReflectHorizontal(xs: number[]) {
  const rotated = [0, 1, 8, 7, 6, 5, 4, 3, 2];
  return applyIndices(xs, rotated);
}

function mooreReflectVertical(xs: number[]) {
  const rotated = [0, 5, 4, 3, 2, 1, 8, 7, 6];
  return applyIndices(xs, rotated);
}

function applyIndices<T>(values: T[], indices: readonly number[]): T[] {
  return indices.map((i) =>
    values[i] ?? (() => {
      throw new Error("internal error");
    })()
  );
}

function internalError(): never {
  throw new Error("internal error");
}

// console.log(JSON.stringify(symmetryMap, null, 2));
