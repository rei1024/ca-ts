import { assertEquals } from "@std/assert";
import { parseXRLELine, parseXRLELineRaw } from "./XRLE.ts";

Deno.test("parseXRLELineRaw", () => {
  const res = parseXRLELineRaw("#CXRLE Pos=0,-1377 Gen=3480106827776");
  assertEquals(res?.get("Pos"), "0,-1377");
  assertEquals(res?.get("Gen"), "3480106827776");
});

Deno.test("parseXRLELineRaw space", () => {
  const res = parseXRLELineRaw("#CXRLE    Pos=0,-1377    Gen=3480106827776");
  assertEquals(res?.get("Pos"), "0,-1377");
  assertEquals(res?.get("Gen"), "3480106827776");
});

Deno.test("parseXRLELine", () => {
  const res = parseXRLELine("#CXRLE Pos=0,-1377 Gen=3480106827776");
  assertEquals(res?.generation, "3480106827776");
  assertEquals(res?.position, { x: 0, y: -1377 });
});
