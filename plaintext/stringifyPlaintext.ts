import type { Plaintext } from "./Plaintext.ts";

/**
 * Convert {@link Plaintext} to a string.
 *
 * ```ts
 * import { stringifyPlaintext } from "@ca-ts/plaintext"
 *
 * stringifyPlaintext({
 *   description: ["!Name: Blinker", "!"],
 *   pattern: [[1, 1, 1]]
 * })
 * ```
 */
export function stringifyPlaintext(
  plaintext:
    & Pick<Plaintext, "description" | "pattern">
    & Partial<Pick<Plaintext, "size">>,
): string {
  if (!plaintext.description.every((line) => line.startsWith("!"))) {
    throw new Error("description must start with !");
  }

  return [
    ...plaintext.description,
    ...plaintext.pattern.map((row) =>
      row.map((c) => c === 0 ? "." : "O").join("")
    ),
  ].join("\n");
}
