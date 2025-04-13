import { intModifiers } from "./int-condition.ts";

/**
 * `console.log(createIndexed().join(" "))
 */
export function createIndexed(): string[] {
  const pat = getAll();

  const resultArray = [];
  for (let i = 0; i < 256; i++) {
    const [a, b, c, d, e, f, g, h] = i.toString(2).padStart(8, "0").split("")
      .reverse();
    const targetArray = [a, b, c, d, "0", e, f, g, h];
    const target = targetArray.join("");
    const num = targetArray.filter((x) => x === "1").length;
    if (num === 0) {
      resultArray.push(`0`);
      continue;
    } else if (num === 8) {
      resultArray.push(`8`);
      continue;
    }

    const patterns = pat[num as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8];

    let found = false;
    for (let j = 0; j < patterns.length; j++) {
      const rotated = rotateReflectList(patterns[j] ?? error());
      if (rotated.includes(target)) {
        resultArray.push(
          `${num}${intModifiers[num as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8][j]}`,
        );
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error("Error: " + JSON.stringify({ i, target, num }));
    }
  }

  return resultArray;
}

function error(): never {
  throw new Error("internal");
}

function getAll() {
  const pat_ = {
    0: ["000000000"],
    1: ["100000000", "010000000"],
    2: [
      "101000000",
      "010100000",
      "010000001",
      "110000000",
      "010000010",
      "100000001",
    ],
    3: [
      "101000001",
      "010101000",
      "010100001",
      "110100000",
      "100100100",
      "101100000",
      "101000010",
      "100100001",
      "001001010",
      "011000010",
    ],
    4: [
      "101000101",
      "010101010",
      "011100001",
      "100100110",
      "101101000",
      "100100101",
      "101000110",
      "110100001",
      "001101010",
      "011001010",
      "111000010",
      "100100011",
      "110000011",
    ],
  };

  const f = (a: string) =>
    a.split("").map((x, i) => x === "0" && i !== 4 ? "1" : "0").join("");

  return {
    ...pat_,
    5: pat_[3].map((a) => f(a)),
    6: pat_[2].map((a) => f(a)),
    7: pat_[1].map((a) => f(a)),
    8: ["111101111"],
  };
}

function rotate90(s: string): string {
  const [a, b, c, d, center, e, f, g, h] = s.split("");

  return [
    // 1
    f,
    d,
    a,
    // 2
    g,
    center,
    b,
    // 3
    h,
    e,
    c,
  ].join("");
}

function reflect(s: string): string {
  const [a, b, c, d, center, e, f, g, h] = s.split("");

  return [
    c,
    b,
    a,
    e,
    center,
    d,
    h,
    g,
    f,
  ].join("");
}

function rotateReflectList(s: string): string[] {
  const rotated90 = rotate90(s);
  const rotated180 = rotate90(rotated90);
  const rotated270 = rotate90(rotated180);
  return [
    s,
    rotated90,
    rotated180,
    rotated270,
    reflect(s),
    reflect(rotated90),
    reflect(rotated180),
    reflect(rotated270),
  ];
}
