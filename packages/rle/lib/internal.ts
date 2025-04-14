import type { CACell } from "../mod.ts";

function getSizeOfPattern(
  cells: readonly CACell[],
): {
  rect: {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
  } | null;
  size: { width: number; height: number };
} {
  if (cells.length === 0) {
    return { rect: null, size: { width: 0, height: 0 } };
  }

  let maxX = -Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let minY = Infinity;
  for (const cell of cells) {
    const cellPosition = cell.position;
    const x = cellPosition.x;
    const y = cellPosition.y;
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
  }

  return {
    rect: {
      maxX,
      maxY,
      minX,
      minY,
    },
    size: {
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    },
  };
}

export function makeOffsetZero(cells: CACell[]): {
  cells: CACell[];
  offset: { dx: number; dy: number };
  size: { width: number; height: number };
} {
  const info = getSizeOfPattern(cells);
  const rect = info.rect;
  if (rect === null) {
    return {
      cells: cells,
      offset: { dx: 0, dy: 0 },
      size: { width: 0, height: 0 },
    };
  }

  const minX = rect.minX;
  const minY = rect.minY;

  return {
    cells: cells.map((cell) => ({
      ...cell,
      position: {
        x: cell.position.x - minX,
        y: cell.position.y - minY,
      },
    })),
    offset: { dx: rect.minX, dy: rect.minY },
    size: info.size,
  };
}
