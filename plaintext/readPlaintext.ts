import type { Plaintext } from "./Plaintext.ts";

/**
 * Parse {@link Plaintext} file.
 */
export function readPlaintext(source: string): Plaintext {
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

  return {
    description,
    pattern,
    size: {
      width: pattern.reduce((acc, x) => Math.max(acc, x.length), 0),
      height: pattern.length,
    },
  };
}
