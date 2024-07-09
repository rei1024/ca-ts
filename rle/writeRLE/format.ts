/**
 * 1行の文字数が`MAX_CHAR`以下になるようにする
 */
export function format(parts: string[], MAX_CHAR: number): string[] {
  const lines: string[] = [];
  let line: string | undefined = undefined;

  for (const part of parts) {
    // TODO partに改行が含まれる場合
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
