import { assertEquals, assertThrows } from "@std/assert";
import { parseIntRule } from "./parse-int.ts";

Deno.test("parseIntRule B3/S23", () => {
  assertEquals(parseIntRule("B3/S23"), {
    type: "int",
    transition: {
      birth: [
        "3a",
        "3c",
        "3e",
        "3i",
        "3j",
        "3k",
        "3n",
        "3q",
        "3r",
        "3y",
      ],
      survive: [
        "2a",
        "2c",
        "2e",
        "2i",
        "2k",
        "2n",
        "3a",
        "3c",
        "3e",
        "3i",
        "3j",
        "3k",
        "3n",
        "3q",
        "3r",
        "3y",
      ],
    },
  });
});

Deno.test("parseIntRule B3/S2-i34q", () => {
  assertEquals(parseIntRule("B3/S2-i34q"), {
    type: "int",
    transition: {
      birth: [
        "3a",
        "3c",
        "3e",
        "3i",
        "3j",
        "3k",
        "3n",
        "3q",
        "3r",
        "3y",
      ],
      survive: [
        "2a",
        "2c",
        "2e",
        "2k",
        "2n",
        "3a",
        "3c",
        "3e",
        "3i",
        "3j",
        "3k",
        "3n",
        "3q",
        "3r",
        "3y",
        "4q",
      ],
    },
  });
});

Deno.test("parseIntRule B3-nqr5ny678/S2-ik3-ry4ein5ky678", () => {
  assertEquals(parseIntRule("B3-nqr5ny678/S2-ik3-ry4ein5ky678"), {
    type: "int",
    transition: {
      birth: [
        "3a",
        "3c",
        "3e",
        "3i",
        "3j",
        "3k",
        "3y",
        "5n",
        "5y",
        "6a",
        "6c",
        "6e",
        "6i",
        "6k",
        "6n",
        "7c",
        "7e",
        "8",
      ],
      survive: [
        "2a",
        "2c",
        "2e",
        "2n",
        "3a",
        "3c",
        "3e",
        "3i",
        "3j",
        "3k",
        "3n",
        "3q",
        "4e",
        "4i",
        "4n",
        "5k",
        "5y",
        "6a",
        "6c",
        "6e",
        "6i",
        "6k",
        "6n",
        "7c",
        "7e",
        "8",
      ],
    },
  });
});

Deno.test("parseIntRule B3k/S4i", () => {
  assertEquals(parseIntRule("B3k/S4i"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
  });
});

Deno.test("parseIntRule order of letters", () => {
  assertEquals(parseIntRule("B1ce2a/S"), parseIntRule("B2a1ec/S"));
});

Deno.test("parseIntRule S/B 3k/4i", () => {
  assertEquals(parseIntRule("3k/4i"), {
    type: "int",
    transition: {
      birth: ["4i"],
      survive: ["3k"],
    },
  });
});

Deno.test("parseIntRule S/B 3k/4i/5", () => {
  assertEquals(parseIntRule("3k/4i/5"), {
    type: "int",
    transition: {
      birth: ["4i"],
      survive: ["3k"],
    },
    generations: 5,
  });
});

Deno.test("parseIntRule S/B B3k/S4i/G5", () => {
  assertEquals(parseIntRule("B3k/S4i/G5"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
    generations: 5,
  });
});

Deno.test("parseIntRule Grid parameter", () => {
  assertEquals(parseIntRule("B3k/S4i:K30*,20"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
    gridParameter: {
      size: {
        width: 30,
        height: 20,
      },
      topology: {
        type: "K",
        twisted: "horizontal",
        shift: null,
      },
    },
  });
});

Deno.test("parseIntRule Generations B3k/S4i/5", () => {
  assertEquals(parseIntRule("B3k/S4i/5"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
    generations: 5,
  });
});

Deno.test("parseIntRule b3k/s4i lower case", () => {
  assertEquals(parseIntRule("b3k/s4i"), {
    type: "int",
    transition: {
      birth: ["3k"],
      survive: ["4i"],
    },
  });
});

Deno.test("parseIntRule B/S", () => {
  assertEquals(parseIntRule("B/S"), {
    type: "int",
    transition: {
      birth: [],
      survive: [],
    },
  });
});

Deno.test("parseIntRule B/S", () => {
  assertEquals(parseIntRule("B1-ce/S"), {
    type: "int",
    transition: {
      birth: [],
      survive: [],
    },
  });
});

Deno.test("parseIntRule error B-/S", () => {
  assertThrows(() => {
    parseIntRule("B-/S");
  });
});

Deno.test("parseIntRule error B9/S", () => {
  assertThrows(() => {
    parseIntRule("B9/S");
  });
});

Deno.test("parseIntRule error B0c/S", () => {
  assertThrows(() => {
    parseIntRule("B0c/S");
  });
});

Deno.test("parseIntRule error B1k/S", () => {
  assertThrows(() => {
    parseIntRule("B1k/S");
  });
});

Deno.test("parseIntRule error B2y/S", () => {
  assertThrows(() => {
    parseIntRule("B2y/S");
  });
});

Deno.test("parseIntRule error B3t/S", () => {
  assertThrows(() => {
    parseIntRule("B3t/S");
  });
});
