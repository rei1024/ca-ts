import { parseMAPRule } from "./map.ts";

Deno.test("parseMAPRule MAP", () => {
  assertEquals(parseMAPRule("MAP"), {
    type: "map",
    transition: new Array(512).fill(0),
  });
});
