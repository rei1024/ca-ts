import type { CACell, RLE } from "./RLE.ts";
import { compressRLE } from "./writeRLE/compressRLE.ts";
import { format } from "./writeRLE/format.ts";
import { writeState } from "./writeRLE/writeState.ts";

/**
 * Option for {@link writeRLE}
 */
export type WriteRLEOptions = {
  /** Use "." and "A" for two states cells if true */
  forceMultiState?: boolean;
  /** max character count for a line. default is 70. */
  maxLineChars?: number;
};

/**
 * Convert {@link RLE} to string.
 */
export function writeRLE(rle: RLE, options?: WriteRLEOptions): string {
  const MAX_CHAR = options?.maxLineChars ?? 70;

  const cells = rle.cells.filter((cell) => cell.state !== 0);

  const isMultiState = options?.forceMultiState
    ? true
    : cells.some((cell) => cell.state > 1);

  const emptyCellChar = isMultiState ? "." : "b";

  const items: { count: number; value: string }[] = [];
  let prevCell: CACell | undefined = undefined;

  for (const cell of cells) {
    const prevY = prevCell?.y ?? 0;
    // -1 is new line
    let prevX = prevCell?.x ?? -1;

    if (cell.y !== prevY) {
      items.push(
        { count: cell.y - prevY, value: "$" },
      );
      prevX = -1;
    }

    if (prevY > cell.y || (prevX !== -1 && prevX > cell.x)) {
      throw new Error("cells must be sorted");
    }

    if (prevX === -1) {
      if (cell.x !== 0) {
        items.push({ count: cell.x, value: emptyCellChar });
      }
    } else if (cell.x - (prevX + 1) >= 1) {
      items.push({ count: cell.x - (prevX + 1), value: emptyCellChar });
    }

    items.push({ count: 1, value: writeState(cell.state, isMultiState) });

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
        const { width, height } = max(rle.cells);
        return `x = ${width}, y = ${height}, `;
      })()) + `rule = ${rle.ruleString}`,
    ...format(parts, MAX_CHAR),
  ].join(
    "\n",
  ) + rle.trailingComment +
    "\n";
}

function max(cells: CACell[]): { width: number; height: number } {
  if (cells.length === 0) {
    return { width: 0, height: 0 };
  }

  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const cell of cells) {
    maxX = Math.max(maxX, cell.x);
    maxY = Math.max(maxY, cell.y);
  }

  return {
    width: maxX + 1,
    height: maxY + 1,
  };
}
