import { encodeBase64 } from "@std/encoding/base64";
import type { MAPRule } from "./core.ts";
import { stringifyGridParameterWithColon } from "../grid/mod.ts";

export function stringifyMap(rule: MAPRule): string {
  const bytes: number[] = [];
  for (let i = 0; i < rule.data.length >> 3; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      const offset = i * 8 + j;
      if (rule.data[offset] !== 0) {
        byte += 2 ** (7 - j);
      }
    }

    bytes.push(byte);
  }

  return `MAP${encodeBase64(new Uint8Array(bytes))}${
    stringifyGridParameterWithColon(rule.gridParameter)
  }`;
}
