import { OffsetTwoDimArray } from "./OffsetTwoDimArray.ts";
import { assertEquals } from "@std/assert";

Deno.test("OffsetTwoDimArray", () => {
  const offsetArray = new OffsetTwoDimArray({ defaultValue: 0 as number });

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 0,
    height: 0,
    array: [],
  });

  offsetArray.reserveX(2);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 3,
    height: 0,
    array: [],
  });

  offsetArray.reserveY(2);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 3,
    height: 3,
    array: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  });

  offsetArray.setCell({ x: 1, y: 2 }, 1);
  assertEquals(offsetArray.getCell({ x: 1, y: 2 }), 1);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 3,
    height: 3,
    array: [[0, 0, 0], [0, 0, 0], [0, 1, 0]],
  });

  offsetArray.reserveX(-1);

  assertEquals(offsetArray.getInternal(), {
    dx: -1,
    dy: 0,
    width: 4,
    height: 3,
    array: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0]],
  });

  offsetArray.setCell({ x: -1, y: 2 }, 2);
  assertEquals(offsetArray.getCell({ x: -1, y: 2 }), 2);
  assertEquals(offsetArray.getInternal(), {
    dx: -1,
    dy: 0,
    width: 4,
    height: 3,
    array: [[0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 1, 0]],
  });
});

Deno.test("OffsetTwoDimArray reserveY", () => {
  const offsetArray = new OffsetTwoDimArray({ defaultValue: 0 as number });

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 0,
    height: 0,
    array: [],
  });

  offsetArray.reserveY(2);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 0,
    height: 3,
    array: [[], [], []],
  });
});

Deno.test("OffsetTwoDimArray reserveY", () => {
  const offsetArray = new OffsetTwoDimArray({ defaultValue: 0 as number });

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 0,
    height: 0,
    array: [],
  });

  offsetArray.reserveY(-2);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: -2,
    width: 0,
    height: 2,
    array: [[], []],
  });

  offsetArray.setCell({ x: 0, y: -2 }, 1);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: -2,
    width: 1,
    height: 2,
    array: [[1], [0]],
  });

  offsetArray.setCell({ x: 0, y: 0 }, 2);
  assertEquals(offsetArray.getCell({ x: 0, y: 0 }), 2);
  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: -2,
    width: 1,
    height: 3,
    array: [[1], [0], [2]],
  });
});

Deno.test("OffsetTwoDimArray (0, 0)", () => {
  const offsetArray = new OffsetTwoDimArray({ defaultValue: 0 as number });

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 0,
    height: 0,
    array: [],
  });

  offsetArray.setCell({ x: 0, y: 0 }, 1);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 1,
    height: 1,
    array: [[1]],
  });
});

Deno.test("OffsetTwoDimArray (1, 1)", () => {
  const offsetArray = new OffsetTwoDimArray({ defaultValue: 0 as number });

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 0,
    height: 0,
    array: [],
  });

  offsetArray.setCell({ x: 1, y: 1 }, 1);

  assertEquals(offsetArray.getInternal(), {
    dx: 0,
    dy: 0,
    width: 2,
    height: 2,
    array: [[0, 0], [0, 1]],
  });

  {
    const res: [number, number, number][] = [];
    offsetArray.forEach(offsetArray.getRect(), (v, p) => {
      res.push([p.x, p.y, v]);
    });
    assertEquals(res, [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 1]]);
  }
});
