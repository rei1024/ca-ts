import { assertEquals } from "@std/assert";
import { bitCount, sort } from "./bitwise.ts";

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
  const array = Array(8).fill(0).map(() => [0, 1]);
  for (const x of cartesian(array)) {
    // @ts-ignore length is corrent
    const sorted = sort(...x);
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

Deno.test("sort", () => {
  checkCorrect();
});

Deno.test("bitCount", () => {
  assertEquals(bitCount(0), 0);
  assertEquals(bitCount(0b1), 1);
  assertEquals(bitCount(0b10), 1);
  assertEquals(bitCount(0b11), 2);
  assertEquals(bitCount(2 ** 31 - 1), 31);

  for (let i = 0; i < 2 ** 10; i++) {
    assertEquals(
      [...i.toString(2)].reduce((acc, x) => x === "1" ? (acc + 1) : acc, 0),
      bitCount(i),
    );
  }
});
