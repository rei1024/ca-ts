import type { Plaintext } from "./Plaintext.ts";

/**
 * Convert {@link Plaintext} to a string.
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
