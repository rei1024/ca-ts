import { assertEquals } from "@std/assert";
import { BitGrid } from "../BitGrid.ts";

Deno.test("BitGrid", () => {
  const grid = BitGrid.make({ width: 32, height: 32 });
  assertEquals(grid.getWidth(), 32);
  assertEquals(grid.getWidth32(), 1);
  assertEquals(grid.getHeight(), 32);
  assertEquals(grid.getPopulation(), 0);
  assertEquals(grid.hasAliveCellAtBorder(), false);

  grid.set(0, 0);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  assertEquals(grid.getPopulation(), 1);
  {
    const array = grid.getArray();
    assertEquals(array.slice(0, 2).map((x) => x.slice(0, 2)), [[1, 0], [0, 0]]);
  }

  grid.set(0, 1);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  assertEquals(grid.getPopulation(), 2);
  {
    const array = grid.getArray();
    assertEquals(array[0]![0], 1);
    assertEquals(array[0]![1], 0);
    assertEquals(array[1]![0], 1);
    assertEquals(array[1]![1], 0);
  }

  grid.clear();
  assertEquals(grid.asInternalUint32Array().every((x) => x === 0), true);

  grid.set(1, 1);
  assertEquals(grid.hasAliveCellAtBorder(), false);
});

Deno.test("BitGrid outerIsAlive", () => {
  const grid = BitGrid.make({ width: 64, height: 64 });
  assertEquals(grid.hasAliveCellAtBorder(), false);

  grid.set(0, 1);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(0, 31);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(0, 32);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(1, 32);
  assertEquals(grid.hasAliveCellAtBorder(), false);
  grid.clear();

  grid.set(0, 63);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(20, 63);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(63, 20);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(62, 20);
  assertEquals(grid.hasAliveCellAtBorder(), false);
  grid.clear();
});

Deno.test("BitGrid make", () => {
  const grid = BitGrid.make({ width: 48, height: 32 });
  assertEquals(grid.getWidth(), 64);
  assertEquals(grid.getWidth32(), 2);
  assertEquals(grid.getHeight(), 32);
});

Deno.test("BitGrid get", () => {
  const grid = BitGrid.make({ width: 32, height: 5 });
  grid.random();
  grid.forEach((i, j, state) => {
    assertEquals(grid.get(j, i), state);
  });
});

Deno.test("BitGrid clone", () => {
  const grid = BitGrid.make({ width: 64, height: 5 });
  grid.set(0, 0);

  const grid2 = grid.clone();
  assertEquals(grid2.getWidth(), 64);
  assertEquals(grid2.getHeight(), 5);
  assertEquals(grid2.get(0, 0), 1);
  grid.set(0, 1);
  assertEquals(grid.get(0, 1), 1);
  assertEquals(grid2.get(0, 1), 0);
});

Deno.test("BitGrid getBoundingBox", () => {
  const grid = BitGrid.make({ width: 32, height: 32 });
  {
    const rect = grid.getBoundingBox();
    assertEquals(rect, {
      maxX: 0,
      minX: 0,
      maxY: 0,
      minY: 0,
    });
  }

  assertEquals(grid.getBoundingBox(), {
    maxX: 0,
    minX: 0,
    maxY: 0,
    minY: 0,
  });

  grid.set(2, 5);
  assertEquals(grid.getBoundingBox(), {
    maxX: 2,
    minX: 2,
    maxY: 5,
    minY: 5,
  });

  grid.set(6, 3);
  assertEquals(grid.getBoundingBox(), {
    maxX: 6,
    minX: 2,
    maxY: 5,
    minY: 3,
  });
});

Deno.test("BitGrid getBoundingBox 2", () => {
  const grid = BitGrid.make({ width: 64, height: 10 });
  assertEquals(grid.getBoundingBox(), {
    maxX: 0,
    minX: 0,
    maxY: 0,
    minY: 0,
  });

  grid.set(37, 5);
  assertEquals(grid.getBoundingBox(), {
    maxX: 37,
    minX: 37,
    maxY: 5,
    minY: 5,
  });

  grid.set(2, 9);
  {
    const rect = grid.getBoundingBox();
    assertEquals(rect, {
      maxX: 37,
      minX: 2,
      maxY: 9,
      minY: 5,
    });
  }
});
