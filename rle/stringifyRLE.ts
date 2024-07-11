import type { CACell, RLE } from "./RLE.ts";
import { getSizeOfCells } from "./getSizeOfCells.ts";
import { compressRLE } from "./stringifyRLE/compressRLE.ts";
import { format } from "./stringifyRLE/format.ts";
import { stateToString } from "./stringifyRLE/stateToString.ts";

/**
 * Options for {@link stringifyRLE}
 */
export type StringifyRLEOptions = {
  /** Use "." and "A" for two states cells if true */
  forceMultiState?: boolean;
  /** max character count for a line. default is 70. */
  maxLineChars?: number;
};

/**
 * Convert {@link RLE} to a string.
 */
export function stringifyRLE(rle: RLE, options?: StringifyRLEOptions): string {
  const MAX_CHAR = options?.maxLineChars ?? 70;

  const cells = rle.cells.filter((cell) => cell.state !== 0);

  const isMultiState = options?.forceMultiState
    ? true
    : cells.some((cell) => cell.state > 1);

  const emptyCellChar = isMultiState ? "." : "b";

  const items: { count: number; value: string }[] = [];
  let prevCell: CACell | undefined = undefined;

  for (const cell of cells) {
    if (cell.position.x < 0 || cell.position.y < 0) {
      throw new Error("Negative position is not supported");
    }

    const prevY = prevCell?.position.y ?? 0;
    // -1 is new line
    let prevX = prevCell?.position.x ?? -1;

    if (cell.position.y !== prevY) {
      items.push(
        { count: cell.position.y - prevY, value: "$" },
      );
      prevX = -1;
    }

    if (prevY > cell.position.y || (prevX !== -1 && prevX > cell.position.x)) {
      throw new Error("cells must be sorted");
    }

    if (prevX === -1) {
      if (cell.position.x !== 0) {
        items.push({ count: cell.position.x, value: emptyCellChar });
      }
    } else if (cell.position.x - (prevX + 1) >= 1) {
      items.push({
        count: cell.position.x - (prevX + 1),
        value: emptyCellChar,
      });
    }

    items.push({ count: 1, value: stateToString(cell.state, isMultiState) });

    prevCell = cell;
  }

  const parts = compressRLE(items).map((x) =>
    (x.count === 1 ? "" : x.count.toString()) + x.value
  );

  if (parts.length === 0) {
    parts.push("!");
  } else {
    parts[parts.length - 1] += "!";
  }

  return [
    ...rle.comments,
    (rle.size != null
      ? `x = ${rle.size.width}, y = ${rle.size.height}, `
      : (() => {
        const { width, height } = getSizeOfCells(rle.cells);
        return `x = ${width}, y = ${height}, `;
      })()) + `rule = ${rle.ruleString}`,
    ...format(parts, MAX_CHAR),
  ].join(
    "\n",
  ) + rle.trailingComment +
    "\n";
}
