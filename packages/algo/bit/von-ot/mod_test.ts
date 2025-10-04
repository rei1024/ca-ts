import { sort4 } from "./mod.ts";

function error(): never {
  throw new Error("assert");
}

function* cartesian<A>(array: A[][]): Generator<A[]> {
  const n = array.length;
  if (n === 1) {
    for (const a of array[0] ?? error()) {
      yield [a];
    }
  } else if (n > 1) {
    for (const as of cartesian(array.slice(0, -1))) {
      for (const a of array[n - 1] ?? error()) {
        yield [...as, a];
      }
    }
  }
}

function checkCorrect() {
  const sum = (a: number[]) => a.reduce((acc, x) => acc + x, 0);
  const array = Array(4).fill(0).map(() => [0, 1]);
  for (const x of cartesian(array)) {
    // @ts-ignore length is correct
    const sorted = sort4(...x);
    const num = sum(sorted);

    if (sorted.slice(sorted.length - num).every((x) => x === 1)) {
      continue;
    }

    if (sum(sorted) === sum(x)) {
      continue;
    }
    throw Error("error" + JSON.stringify({ x }));
  }
}

Deno.test("sort4", () => {
  checkCorrect();
});
