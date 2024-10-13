import { assertEquals } from "@std/assert";
import { parseRule } from "./mod.ts";

Deno.test("parseRule B3/S23", () => {
  assertEquals(parseRule("B3/S23"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
});
