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
    maxX = Math.max(maxX, cell.position.x);
    maxY = Math.max(maxY, cell.position.y);
    minX = Math.min(minX, cell.position.x);
    minY = Math.min(minY, cell.position.y);
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

  return {
    cells: cells.map((cell) => ({
      ...cell,
      position: {
        x: cell.position.x - rect.minX,
        y: cell.position.y - rect.minY,
      },
    })),
    offset: { dx: rect.minX, dy: rect.minY },
    size: info.size,
  };
}
