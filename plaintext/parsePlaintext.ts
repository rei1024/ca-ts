import type { Plaintext } from "./Plaintext.ts";

/**
 * Parse {@link Plaintext} file.
 *
 * ```ts
 * parsePlaintext(`!Name: Glider
 * !
 * .O.
 * ..O
 * OOO`)
 * ```
 */
export function parsePlaintext(source: string): Plaintext {
  const description: string[] = [];
  const pattern: number[][] = [];
  const lines = source.split(/\n|\r\n/g);

  for (const line of lines) {
    if (line.startsWith("!")) {
      description.push(line);
    } else {
      pattern.push([...line].map((c) => c === "O" ? 1 : 0));
    }
  }

  const width = pattern.reduce((acc, x) => Math.max(acc, x.length), 0);

  for (const [i, row] of pattern.entries()) {
    if (row.length < width) {
      pattern[i] = row.concat(Array(width - row.length).fill(0).map(() => 0));
    }
  }

  return {
    description,
    pattern,
    size: {
      width: width,
      height: pattern.length,
    },
  };
}
