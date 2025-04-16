import { encodeBase64 } from "@std/encoding/base64";
import type { MAPRule } from "./core.ts";
import { stringifyGridParameterWithColon } from "../grid/mod.ts";

export function stringifyMap(rule: MAPRule): string {
  const data = rule.data;

  switch (rule.neighbors) {
    case "moore": {
      if (data.length !== 512) {
        throw new Error("needs 512 bits");
      }
      break;
    }
    case "hexagonal": {
      if (data.length !== 128) {
        throw new Error("needs 128 bits");
      }
      break;
    }
    case "von-neumann": {
      if (data.length !== 32) {
        throw new Error("needs 32 bits");
      }
    }
  }

  const bytes: number[] = [];
  const bytesLength = data.length >> 3;
  for (let i = 0; i < bytesLength; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      const offset = i * 8 + j;
      if (data[offset] !== 0) {
        byte += 2 ** (7 - j);
      }
    }

    bytes.push(byte);
  }

  let encoded = encodeBase64(new Uint8Array(bytes));
  if (encoded.endsWith("==")) {
    encoded = encoded.slice(0, -2);
  }

  return `MAP${encoded}${stringifyGridParameterWithColon(rule.gridParameter)}`;
}
