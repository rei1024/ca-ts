/**
 * Ensure that the number of characters in one line is less than or equal to `MAX_CHAR`.
 */
export function format(parts: string[], MAX_CHAR: number): string[] {
  const lines: string[] = [];
  let line: string | undefined = undefined;

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
