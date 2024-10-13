import { assertEquals } from "@std/assert";
import { parseOuterTotalistic } from "./outer-totalistic.ts";

Deno.test("parseOuterTotalistic B3/S23", () => {
  assertEquals(parseOuterTotalistic("B3/S23"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
});

Deno.test("parseOuterTotalistic 23/3", () => {
  assertEquals(parseOuterTotalistic("23/3"), {
    type: "outer-totalistic",
    transition: {
      birth: [3],
      survive: [2, 3],
    },
  });
});
