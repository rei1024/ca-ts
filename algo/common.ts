export interface Rect {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function rectToSize(
  { minX, minY, maxX, maxY }: Rect,
): { sizeX: number; sizeY: number } {
  return {
    sizeX: maxX - minX + 1,
    sizeY: maxY - minY + 1,
  };
}

export function rectToArea(rect: Rect): number {
  const { sizeX, sizeY } = rectToSize(rect);
  return sizeX * sizeY;
}
