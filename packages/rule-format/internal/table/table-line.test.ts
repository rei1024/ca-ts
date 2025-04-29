import { assertEquals, assertThrows } from "@std/assert";
import { parseRuleTableLine, stringifyRuleTableLine } from "./table-line.ts";

Deno.test("parseRuleTableLine", () => {
  assertEquals(
    parseRuleTableLine(""),
    { type: "empty" },
  );

  assertEquals(
    parseRuleTableLine("var a={0,1,2}"),
    {
      type: "variable",
      variable: { name: "a", values: ["0", "1", "2"] },
    },
  );
  assertEquals(
    parseRuleTableLine("var  abc = { 0 , 1 , 2 } "),
    {
      type: "variable",
      variable: { name: "abc", values: ["0", "1", "2"] },
    },
  );

  assertEquals(
    parseRuleTableLine("n_states: 4"),
    { type: "n_states", numberOfStates: 4 },
  );
  assertEquals(
    parseRuleTableLine("neighborhood:vonNeumann"),
    { type: "neighborhood", neighborhood: "vonNeumann" },
  );
  assertEquals(
    parseRuleTableLine("symmetries:none"),
    { type: "symmetries", symmetries: "none" },
  );

  assertEquals(
    parseRuleTableLine("# This is a comment"),
    { type: "comment", comment: "# This is a comment" },
  );
  assertEquals(
    parseRuleTableLine("  # This is a comment"),
    { type: "comment", comment: "# This is a comment" },
  );

  assertEquals(
    parseRuleTableLine("0,1,2,3,4"),
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
    parseRuleTableLine("var a={0,1,2");
  });

  assertThrows(() => {
    parseRuleTableLine("var ={0,1,2}");
  });

  assertThrows(() => {
    parseRuleTableLine("var a={0,,2}");
  });

  assertThrows(() => {
    parseRuleTableLine(",");
  });
});

Deno.test("parseRuleTableLine stringifyRuleTableLine", () => {
  function assertBack(line: string) {
    const parsedLine = parseRuleTableLine(line);
    assertEquals(stringifyRuleTableLine(parsedLine), line);
  }

  assertBack("");
  assertBack("var a={0,1,2}");
  assertBack("var abc={0}");
  assertBack("n_states:4");
  assertBack("neighborhood:vonNeumann");
  assertBack("neighborhood:Moore");
  assertBack("neighborhood:hexagonal");
  assertBack("symmetries:none");
  assertBack("# This is a comment");
  assertBack("0,1,2,3,4");
  assertBack("0,1,2,a,b,c");
});
