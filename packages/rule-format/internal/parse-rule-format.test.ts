import { assertEquals, assertThrows } from "@std/assert";
import { parseRuleFormat } from "./parse-rule-format.ts";
import { WireWorldRule } from "./test-data/rule-data.ts";

Deno.test("parseRuleFormat WireWorld", () => {
  const ruleFormat = parseRuleFormat(WireWorldRule);
  assertEquals({
    ...ruleFormat,
    table: undefined,
    rawSections: undefined,
  }, {
    name: "WireWorld",
    description: [
      "",
      "A 4-state CA created by Brian Silverman.  WireWorld models the flow of",
      "currents in wires and makes it relatively easy to build logic gates",
      "and other digital circuits.",
      "",
    ],
    table: undefined,
    rawSections: undefined,
  });

  assertEquals(ruleFormat.table?.lines.slice(0, 3), [
    {
      type: "empty",
    },
    {
      comment: "# Golly rule-table format.",
      type: "comment",
    },
    {
      comment: "# Each rule: C,N,NE,E,SE,S,SW,W,NW,C'",
      type: "comment",
    },
  ]);
});

Deno.test("parseRuleFormat Error", () => {
  assertThrows(() => {
    parseRuleFormat(``);
  });

  assertThrows(() => {
    parseRuleFormat(`@RULE Test\n@RULE Test2`);
  });
});
