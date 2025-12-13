import { parseRLE } from "@ca-ts/rle";
import { RLE_TEST_DATA } from "./test-data/mod.ts";

const header = RLE_TEST_DATA.chacha.split("\n").slice(0, 7).join("\n") + "\n";
const extracted = RLE_TEST_DATA.chacha.split("\n").slice(7).join("\n").slice(
  0,
  -1,
) + "\n";

const big = header + extracted.repeat(100) + "!";

Deno.bench({
  name: "parseRLE chacha",
  fn() {
    parseRLE(big);
  },
});
