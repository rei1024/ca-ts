import { assertEquals } from "@std/assert";
import { format } from "./format.ts";

Deno.test("format", () => {
  assertEquals(format([], 5), []);

  assertEquals(format(["x"], 5), ["x"]);

  assertEquals(format(["12345"], 5), ["12345"]);
  assertEquals(format(["123456"], 5), ["123456"]);

  assertEquals(format(["123", "456"], 5), ["123", "456"]);
  assertEquals(format(["123", "456789"], 5), ["123", "456789"]);

  assertEquals(format(["1", "2", "3", "4", "5", "6"], 5), ["12345", "6"]);

  assertEquals(format(["1", "2", "3", "4", "5", "6", "7"], 5), ["12345", "67"]);

  assertEquals(format(["1", "2", "3", "4", "56", "7"], 5), ["1234", "567"]);
});
