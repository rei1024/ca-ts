import { assertEquals } from "@std/assert";
import { compressRLE } from "./compressRLE.ts";

Deno.test("compressRLE", () => {
  assertEquals(compressRLE([]), []);
  assertEquals(compressRLE([{ count: 1, value: "x" }]), [{
    count: 1,
    value: "x",
  }]);

  assertEquals(
    compressRLE([{ count: 1, value: "x" }, { count: 1, value: "x" }]),
    [{
      count: 2,
      value: "x",
    }],
  );

  assertEquals(
    compressRLE([{ count: 1, value: "x" }, { count: 1, value: "y" }]),
    [{
      count: 1,
      value: "x",
    }, {
      count: 1,
      value: "y",
    }],
  );

  assertEquals(
    compressRLE([{ count: 1, value: "x" }, { count: 1, value: "y" }, {
      count: 2,
      value: "y",
    }]),
    [{
      count: 1,
      value: "x",
    }, {
      count: 3,
      value: "y",
    }],
  );

  assertEquals(
    compressRLE([{ count: 0, value: "x" }]),
    [{ count: 0, value: "x" }],
  );

  assertEquals(
    compressRLE([{ count: 1, value: "x" }, { count: -1, value: "x" }]),
    [{ count: 0, value: "x" }],
  );
});
