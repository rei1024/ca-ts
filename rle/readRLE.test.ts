import { readRLE } from "./readRLE.ts";
import { RLE_TEST_DATA } from "./test-data/mod.ts";

Deno.test("readRLE", () => {
  readRLE(RLE_TEST_DATA.p52Gun);
});
