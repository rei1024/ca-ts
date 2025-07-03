export function equalUint32Array(a: Uint32Array, b: Uint32Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const len = a.length;

  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
