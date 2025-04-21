export function compressRLE<T>(
  array: readonly { count: number; value: T }[],
): { count: number; value: T }[] {
  const encoded: { count: number; value: T }[] = [];
  let prev: { count: number; value: T } | null = null;

  for (const item of array) {
    if (prev !== null) {
      if (item.value === prev.value) {
        prev.count += item.count;
      } else {
        encoded.push({ count: prev.count, value: prev.value });

        prev = item;
      }
    } else {
      prev = item;
    }
  }

  if (prev !== null) {
    encoded.push({ count: prev.count, value: prev.value });
  }

  return encoded;
}
