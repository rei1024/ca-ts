import { assertEquals, assertThrows } from "@std/assert";
import { resolveTable, resolveVariableTransition } from "./resolve-table.ts";
import { parseRuleFormat } from "../parse-rule-format.ts";
import { WireWorldRule } from "../test-data/rule-data.ts";

Deno.test("resolveTable", () => {
  const table = parseRuleFormat(WireWorldRule);
  const resolved = resolveTable(table.table?.lines ?? []);
});

Deno.test("resolveVariable", () => {
  assertEquals(
    resolveVariableTransition([], []),
    [],
  );

  assertEquals(
    resolveVariableTransition([{ name: "a", values: ["0", "1"] }], [{
      condition: ["a"],
      to: "2",
    }]),
    [
      { condition: ["0"], to: "2" },
      { condition: ["1"], to: "2" },
    ],
  );

  assertEquals(
    resolveVariableTransition([{ name: "a", values: ["0", "1"] }, {
      name: "b",
      values: ["a"],
    }], [{
      condition: ["b"],
      to: "2",
    }]),
    [
      { condition: ["0"], to: "2" },
      { condition: ["1"], to: "2" },
    ],
  );

  assertEquals(
    resolveVariableTransition([{ name: "a", values: ["0", "1"] }, {
      name: "b",
      values: ["2", "3"],
    }], [{
      condition: ["a", "b"],
      to: "2",
    }]),
    [
      { condition: ["0", "2"], to: "2" },
      { condition: ["0", "3"], to: "2" },
      { condition: ["1", "2"], to: "2" },
      { condition: ["1", "3"], to: "2" },
    ],
  );
});

Deno.test("resolveVariable error", () => {
  assertThrows(() => {
    resolveVariableTransition([{ name: "a", values: ["0", "1"] }], [{
      condition: ["b"],
      to: "2",
    }]);
  });

  assertThrows(() => {
    resolveVariableTransition([{ name: "a", values: ["0", "1"] }, {
      name: "a",
      values: ["2", "3"],
    }], [{
      condition: ["a"],
      to: "2",
    }]);
  });

  assertThrows(() => {
    resolveVariableTransition([{ name: "a", values: ["a"] }], [{
      condition: ["0", "1"],
      to: "2",
    }]);
  });
});
