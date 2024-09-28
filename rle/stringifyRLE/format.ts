/**
 * Ensure that the number of characters in one line is less than or equal to `MAX_CHAR`.
 *
 * @throws when MAX_CHAR is not a positive integer
 */
export function format(parts: string[], MAX_CHAR: number): string[] {
  const lines: string[] = [];
  let line: string | undefined = undefined;

  if (!Number.isInteger(MAX_CHAR) || MAX_CHAR <= 0) {
    throw new Error("MAX_CHAR is not a positive integer");
  }

  for (const part of parts) {
    // TODO: when `part` contains "\n"
    const nextLineLength = (line?.length ?? 0) + part.length;
    if (nextLineLength > MAX_CHAR) {
      if (line !== undefined) {
        lines.push(line);
      }
      line = part;
    } else {
      if (line === undefined) {
        line = "";
      }
      line += part;
    }
  }

  if (line !== undefined) {
    lines.push(line);
  }

  return lines;
}
