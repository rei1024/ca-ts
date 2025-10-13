import { decodeBase64 } from "@std/encoding/base64";

export function decodeBase64Fallback(str: string): Uint8Array {
  if (Uint8Array.fromBase64 !== undefined) {
    return Uint8Array.fromBase64(str);
  } else {
    return decodeBase64(str);
  }
}
