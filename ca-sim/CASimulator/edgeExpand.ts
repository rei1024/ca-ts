import type { OffsetTwoDimArray } from "./OffsetTwoDimArray.ts";

export function edgeExpand<
  T extends string | boolean | number | bigint | null | undefined,
>(
  offsetArray: OffsetTwoDimArray<T>,
) {
  const defaultValue = offsetArray.config.defaultValue;
  const { dx, dy, width, height } = offsetArray.getInternal();

  if (width === 0 || height === 0) {
    return;
  }

  // left
  for (let i = dy; i < dy + height; i++) {
    const pos = { x: dx, y: i };
    const value = offsetArray.getCell(pos);
    if (value !== defaultValue) {
      offsetArray.reserveX(dx - 1);
      break;
    }
  }

  // right
  for (let i = dy; i < dy + height; i++) {
    const pos = { x: dx + width - 1, y: i };
    const value = offsetArray.getCell(pos);
    if (value !== defaultValue) {
      offsetArray.reserveX(dx + width);
      break;
    }
  }

  // top
  for (let j = dx; j < dx + width; j++) {
    const pos = { x: j, y: dy };
    const value = offsetArray.getCell(pos);
    if (value !== defaultValue) {
      offsetArray.reserveY(dy - 1);
      break;
    }
  }

  // bottom
  for (let j = dx; j < dx + width; j++) {
    const pos = { x: j, y: dy + height - 1 };
    const value = offsetArray.getCell(pos);
    if (value !== defaultValue) {
      offsetArray.reserveY(dy + height);
      break;
    }
  }
}
