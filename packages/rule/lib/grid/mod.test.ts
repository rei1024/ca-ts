import { assertEquals } from "@std/assert/equals";
import { parseGridParameter, stringifyGridParameter } from "./mod.ts";
import { assertThrows } from "@std/assert/throws";

Deno.test("parseGridParameter Plane", () => {
  assertEquals(parseGridParameter("P20,30"), {
    size: {
      width: 20,
      height: 30,
    },
    topology: { type: "P" },
  });
});

Deno.test("parseGridParameter Plane lower case", () => {
  assertEquals(parseGridParameter("p20,30"), {
    size: {
      width: 20,
      height: 30,
    },
    topology: { type: "P" },
  });
});

Deno.test("parseGridParameter Sphere", () => {
  assertEquals(parseGridParameter("S30"), {
    size: {
      width: 30,
      height: 30,
    },
    topology: { type: "S", join: "top-to-left" },
  });

  assertEquals(parseGridParameter("S30*"), {
    size: {
      width: 30,
      height: 30,
    },
    topology: { type: "S", join: "top-to-right" },
  });

  assertThrows(() => {
    parseGridParameter("S0");
  });

  assertThrows(() => {
    parseGridParameter("S-1");
  });

  assertThrows(() => {
    parseGridParameter("S10**");
  });

  assertThrows(() => {
    parseGridParameter("S10,10");
  });
});

Deno.test("parseGridParameter Cross-surface", () => {
  assertEquals(parseGridParameter("C10,20"), {
    size: {
      width: 10,
      height: 20,
    },
    topology: { type: "C" },
  });

  assertThrows(() => {
    parseGridParameter("C0,20");
  });

  assertThrows(() => {
    parseGridParameter("C10,0");
  });
});

Deno.test("parseGridParameter Torus", () => {
  assertEquals(parseGridParameter("T4,3"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: { type: "T", shift: null },
  });

  // infinite
  assertEquals(parseGridParameter("T4,0"), {
    size: {
      width: 4,
      height: 0,
    },
    topology: { type: "T", shift: null },
  });

  assertEquals(parseGridParameter("T4+1,3"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: {
      type: "T",
      shift: {
        edge: "horizontal",
        amount: 1,
      },
    },
  });

  assertEquals(parseGridParameter("T4,3+1"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: {
      type: "T",
      shift: {
        edge: "vertical",
        amount: 1,
      },
    },
  });

  assertEquals(parseGridParameter("T4,3-2"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: {
      type: "T",
      shift: {
        edge: "vertical",
        amount: -2,
      },
    },
  });

  assertThrows(() => {
    parseGridParameter("T4+1,3+1");
  });
});

Deno.test("parseGridParameter Klein bottle", () => {
  assertEquals(parseGridParameter("K4,3"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: { type: "K", twisted: "vertical", shift: null },
  });

  assertEquals(parseGridParameter("K4,3*"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: { type: "K", twisted: "vertical", shift: null },
  });

  assertEquals(parseGridParameter("K4*,3"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: { type: "K", twisted: "horizontal", shift: null },
  });

  assertEquals(parseGridParameter("K4*+1,3"), {
    size: {
      width: 4,
      height: 3,
    },
    topology: { type: "K", twisted: "horizontal", shift: 1 },
  });

  const invalidItems = [
    "K4*,3*",
    "K4+1,3*",
    "K4*,4+1",
    "K4*,0",
    "K3*+1,4", // shift have to for even size
    "K4,3*+1", // shift have to for even size
  ];

  for (const item of invalidItems) {
    assertThrows(() => {
      parseGridParameter(item);
    });
  }
});

Deno.test("stringifyGridParameter parseGridParameter", () => {
  const items = [
    "P10,20",
    "T0,20",
    "T30+5,20",
    "T30,20+5",
    "T30-3,20",
    "T30,20-3",
    "K30*,20",
    "K30,20*",
    "K30*+1,20",
    "K30,20*+1",
    "C30,20",
    "S30",
  ];
  for (const item of items) {
    assertEquals(stringifyGridParameter(parseGridParameter(item)!), item);
  }
});

Deno.test("stringifyGridParameter offset 0", () => {
  assertEquals(
    stringifyGridParameter({
      size: { width: 20, height: 30 },
      topology: { type: "T", shift: { edge: "horizontal", amount: 0 } },
    }),
    "T20,30",
  );
});

Deno.test("stringifyGridParameter width height NaN", () => {
  assertThrows(() => {
    stringifyGridParameter({
      size: { width: NaN, height: 30 },
      topology: { type: "T", shift: null },
    });
  });

  assertThrows(() => {
    stringifyGridParameter({
      size: { width: 20, height: NaN },
      topology: { type: "T", shift: null },
    });
  });
});

Deno.test("stringifyGridParameter offset NaN", () => {
  assertThrows(() => {
    stringifyGridParameter({
      size: { width: 20, height: 30 },
      topology: { type: "T", shift: { edge: "horizontal", amount: NaN } },
    });
  });
});
