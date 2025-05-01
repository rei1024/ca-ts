import { assertEquals, assertThrows } from "@std/assert";
import { parseRuleTableLine, stringifyRuleTableLine } from "./table-line.ts";

Deno.test("parseRuleTableLine", () => {
  assertEquals(
    parseRuleTableLine("", undefined),
    { type: "empty" },
  );

  assertEquals(
    parseRuleTableLine("var a={0,1,2}", undefined),
    {
      type: "variable",
      variable: { name: "a", values: ["0", "1", "2"] },
    },
  );
  assertEquals(
    parseRuleTableLine("var a={0,1,2} # This is a comment", undefined),
    {
      type: "variable",
      variable: { name: "a", values: ["0", "1", "2"] },
      comment: "# This is a comment",
    },
  );
  assertEquals(
    parseRuleTableLine("var a={0,b,2}", undefined),
    {
      type: "variable",
      variable: { name: "a", values: ["0", "b", "2"] },
    },
  );
  assertEquals(
    parseRuleTableLine("var  abc = { 0 , 1 , 2 } ", undefined),
    {
      type: "variable",
      variable: { name: "abc", values: ["0", "1", "2"] },
    },
  );

  assertEquals(
    parseRuleTableLine("n_states: 4", undefined),
    { type: "n_states", numberOfStates: 4 },
  );
  assertEquals(
    parseRuleTableLine("neighborhood:vonNeumann", undefined),
    { type: "neighborhood", neighborhood: "vonNeumann" },
  );
  assertEquals(
    parseRuleTableLine("symmetries:none", undefined),
    { type: "symmetries", symmetries: "none" },
  );

  assertEquals(
    parseRuleTableLine("# This is a comment", undefined),
    { type: "comment", comment: "# This is a comment" },
  );
  assertEquals(
    parseRuleTableLine("  # This is a comment", undefined),
    { type: "comment", comment: "# This is a comment" },
  );

  assertEquals(
    parseRuleTableLine("0,1,2,3,4", undefined),
    {
      type: "transition",
      transition: {
        condition: ["0", "1", "2", "3"],
        to: "4",
      },
    },
  );

  assertEquals(
    parseRuleTableLine("0,1,2,3,a", undefined),
    {
      type: "transition",
      transition: {
        condition: ["0", "1", "2", "3"],
        to: "a",
      },
    },
  );

  assertEquals(
    parseRuleTableLine("0,1,2,3,4 # This is a comment", undefined),
    {
      type: "transition",
      transition: {
        condition: ["0", "1", "2", "3"],
        to: "4",
      },
      comment: "# This is a comment",
    },
  );

  assertEquals(
    parseRuleTableLine("0,1,2,3,4 # This is a comment # more sharp", undefined),
    {
      type: "transition",
      transition: {
        condition: ["0", "1", "2", "3"],
        to: "4",
      },
      comment: "# This is a comment # more sharp",
    },
  );

  assertEquals(
    parseRuleTableLine("01234", 10),
    {
      type: "transition",
      transition: {
        condition: ["0", "1", "2", "3"],
        to: "4",
      },
    },
  );
});

Deno.test("parseRuleTableLine error", () => {
  assertThrows(() => {
    parseRuleTableLine("var a={0,1,2", undefined);
  });

  assertThrows(() => {
    parseRuleTableLine("var ={0,1,2}", undefined);
  });

  assertThrows(() => {
    parseRuleTableLine("var a={0,,2}", undefined);
  });

  assertThrows(() => {
    parseRuleTableLine(",", undefined);
  });

  // if n_states is greater than 10, comma omitted format is not allowed
  assertThrows(() => {
    parseRuleTableLine("01234", 11);
  });

  // variable cannot be used in comma omitted format
  assertThrows(() => {
    parseRuleTableLine("a1234", 10);
  });
});

Deno.test("parseRuleTableLine stringifyRuleTableLine", () => {
  function assertBack(line: string) {
    const parsedLine = parseRuleTableLine(line, undefined);
    assertEquals(stringifyRuleTableLine(parsedLine), line);
  }

  assertBack("");
  assertBack("var a={0,1,2}");
  assertBack("var a={0,1,2} # This is a comment");
  assertBack("var abc={0}");
  assertBack("n_states:4");
  assertBack("neighborhood:vonNeumann");
  assertBack("neighborhood:Moore");
  assertBack("neighborhood:hexagonal");
  assertBack("symmetries:none");
  assertBack("# This is a comment");
  assertBack("0,1,2,3,4");
  assertBack("0,1,2,3,4 # This is a comment");
  assertBack("0,1,2,a,b,c");
});
