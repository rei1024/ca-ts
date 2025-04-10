import type { CACell, RLE } from "./RLE.ts";
import { makeOffsetZero } from "./lib/internal.ts";
import { compressRLE } from "./stringifyRLE/compressRLE.ts";
import { format } from "./stringifyRLE/format.ts";
import { stateToString } from "./stringifyRLE/stateToString.ts";

/**
 * Options for {@link stringifyRLE}
 */
export type StringifyRLEOptions = {
  /** Use "." and "A" for two states cells if true */
  readonly forceMultiState?: boolean;
  /**
   * Max character count for a line. default is 70.
   * @default 70
   */
  readonly maxLineChars?: number;
  /**
   * Accept unordered cells. default is false.
   * @default false
   */
  readonly acceptUnorderedCells?: boolean;
};

/**
 * Convert {@link RLE} to a string.
 */
export function stringifyRLE(
  rle: Partial<RLE>,
  options?: StringifyRLEOptions,
): string {
  const MAX_CHAR = options?.maxLineChars ?? 70;

  let cells = (rle.cells ?? []).filter((cell) => cell.state !== 0);

  if (options?.acceptUnorderedCells) {
    cells.sort((a, b) => {
      if (a.position.y === b.position.y) {
        return a.position.x - b.position.x;
      } else {
        return a.position.y - b.position.y;
      }
    });
  }

  if (rle.XRLE?.position) {
    const offset = rle.XRLE.position;
    const offsetX = offset.x;
    const offsetY = offset.y;
    cells = cells.map((c) => {
      return {
        position: {
          x: c.position.x - offsetX,
          y: c.position.y - offsetY,
        },
        state: c.state,
      };
    });
  }

  const isMultiState = options?.forceMultiState
    ? true
    : cells.some((cell) => cell.state > 1);

  const offsetZeroPattern = makeOffsetZero(cells);
  cells = offsetZeroPattern.cells;

  const items = cellsToItems(cells, isMultiState);

  const parts = compressRLE(items).map((x) =>
    (x.count === 1 ? "" : x.count.toString()) + x.value
  );

  if (parts.length === 0) {
    parts.push("!");
  } else {
    parts[parts.length - 1] += "!";
  }

  const cxrleComment = rle.comments?.every((x) => !x.startsWith("#CXRLE")) &&
      (offsetZeroPattern.offset.dx !== 0 ||
        offsetZeroPattern.offset.dy !== 0)
    ? [
      `#CXRLE Pos=${offsetZeroPattern.offset.dx},${offsetZeroPattern.offset.dy}`,
    ]
    : [];

  const size = rle.size != null
    ? `x = ${rle.size.width}, y = ${rle.size.height}`
    : `x = ${offsetZeroPattern.size.width}, y = ${offsetZeroPattern.size.height}`;

  return [
    ...cxrleComment,
    ...rle.comments ?? [],
    size + `, rule = ${rle.ruleString ?? "B3/S23"}`,
    ...format(parts, MAX_CHAR),
  ].join(
    "\n",
  ) + (rle.trailingComment ?? "") +
    "\n";
}

function cellsToItems(
  cells: CACell[],
  isMultiState: boolean,
): { count: number; value: string }[] {
  const emptyCellChar = isMultiState ? "." : "b";

  const items: { count: number; value: string }[] = [];
  let prevCell: CACell | undefined = undefined;

  for (const cell of cells) {
    const currentX = cell.position.x;
    const currentY = cell.position.y;

    if (currentX < 0 || currentY < 0) {
      throw new Error("Internal error: makeOffsetZero failed");
    }

    const prevY = prevCell?.position.y ?? 0;

    // -1 is new line
    const NEW_LINE_MARKER = -1;

    let prevX = prevCell?.position.x ?? NEW_LINE_MARKER;

    if (currentY !== prevY) {
      items.push(
        { count: currentY - prevY, value: "$" },
      );
      prevX = NEW_LINE_MARKER;
    }

    if (prevY > currentY || (prevX !== NEW_LINE_MARKER && prevX > currentX)) {
      throw new Error("cells must be sorted");
    }

    if (prevX === NEW_LINE_MARKER) {
      if (currentX !== 0) {
        items.push({ count: currentX, value: emptyCellChar });
      }
    } else if (currentX - (prevX + 1) >= 1) {
      items.push({
        count: currentX - (prevX + 1),
        value: emptyCellChar,
      });
    }

    items.push({ count: 1, value: stateToString(cell.state, isMultiState) });

    prevCell = cell;
  }

  return items;
}
