import { assertEquals, assertThrows } from "@std/assert";
import { BitGrid } from "../BitGrid.ts";

Deno.test("BitGrid construct", () => {
  assertThrows(() => {
    BitGrid.make({ width: 1.5, height: 2 });
  });

  assertThrows(() => {
    new BitGrid(1, 2, new Uint32Array());
  });

  assertThrows(() => {
    new BitGrid(1.5, 2, new Uint32Array());
  });

  assertThrows(() => {
    new BitGrid(NaN, 2, new Uint32Array());
  });

  assertThrows(() => {
    new BitGrid(-1, 0, new Uint32Array());
  });

  assertThrows(() => {
    new BitGrid(Infinity, 0, new Uint32Array());
  });
});

Deno.test("BitGrid", () => {
  const grid = BitGrid.make({ width: 32, height: 32 });
  assertEquals(grid.getWidth(), 32);
  assertEquals(grid.getWidth32(), 1);
  assertEquals(grid.getHeight(), 32);
  assertEquals(grid.getPopulation(), 0);
  assertEquals(grid.hasAliveCellAtBorder(), false);
  assertEquals(grid.borderAlive(), {
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  grid.set(0, 0);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  assertEquals(grid.borderAlive(), {
    left: true,
    right: false,
    top: true,
    bottom: false,
  });
  assertEquals(grid.getPopulation(), 1);
  {
    const array = grid.getArray();
    assertEquals(array.length, 32);
    assertEquals(array.every((row) => row.length === 32), true);
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
  assertEquals(grid.borderAlive(), {
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  grid.clear();

  grid.set(0, 63);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  assertEquals(grid.borderAlive(), {
    left: true,
    right: false,
    top: false,
    bottom: true,
  });

  grid.clear();

  grid.set(20, 63);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  assertEquals(grid.borderAlive(), {
    left: false,
    right: false,
    top: false,
    bottom: true,
  });
  grid.clear();

  grid.set(63, 20);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  grid.clear();

  grid.set(62, 20);
  assertEquals(grid.hasAliveCellAtBorder(), false);
  grid.clear();

  grid.set(63, 63);
  assertEquals(grid.hasAliveCellAtBorder(), true);
  assertEquals(grid.borderAlive(), {
    left: false,
    right: true,
    top: false,
    bottom: true,
  });
  grid.clear();
});

Deno.test("BitGrid forEachAlive", () => {
  const grid = BitGrid.make({ width: 64, height: 64 });
  let count = 0;
  grid.forEachAlive(() => {
    count++;
  });
  assertEquals(count, 0);
  grid.set(0, 0);
  grid.forEachAlive(() => {
    count++;
  });
  assertEquals(count, 1);
});

Deno.test("BitGrid forEach", () => {
  const grid = BitGrid.make({ width: 64, height: 64 });
  let count = 0;
  grid.forEach(() => {
    count++;
  });
  assertEquals(count, 64 * 64);
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
  grid.forEach((x, y, state) => {
    assertEquals(grid.get(x, y), state);
  });
});

Deno.test("BitGrid get set unset", () => {
  const grid = BitGrid.make({ width: 32, height: 5 });
  grid.set(2, 3);
  assertEquals(grid.get(2, 3), 1);
  grid.unset(2, 3);
  assertEquals(grid.get(2, 3), 0);
});

Deno.test("BitGrid expanded expandX", () => {
  const grid = BitGrid.make({ width: 32, height: 5 });
  const newGrid = grid.expanded({ expand: { x: 32, y: 0 } });
  assertEquals(newGrid.getWidth(), 64);
  assertEquals(newGrid.getHeight(), 5);
});

Deno.test("BitGrid expanded expandY", () => {
  const grid = BitGrid.make({ width: 32, height: 5 });
  const newGrid = grid.expanded({ expand: { x: 0, y: 7 } });
  assertEquals(newGrid.getWidth(), 32);
  assertEquals(newGrid.getHeight(), 12);
});

Deno.test("BitGrid expanded with offset", () => {
  const grid = BitGrid.make({ width: 32, height: 5 });
  grid.set(1, 1);
  const newGrid = grid.expanded({
    expand: { x: 0, y: 7 },
    offset: {
      x: 0,
      y: 2,
    },
  });
  assertEquals(newGrid.get(1, 1), 0);
  assertEquals(newGrid.get(1, 3), 1);
  assertEquals(newGrid.getHeight(), 12);
});

Deno.test("BitGrid expanded with offset x", () => {
  const grid = BitGrid.make({ width: 32, height: 5 });
  grid.set(1, 1);
  const newGrid = grid.expanded({
    expand: { x: 32, y: 7 },
    offset: {
      x: 32,
      y: 3,
    },
  });

  assertEquals(newGrid.get(1, 1), 0);
  assertEquals(newGrid.get(33, 4), 1);

  assertEquals(newGrid.getHeight(), 12);
  assertEquals(newGrid.getWidth(), 64);
  assertEquals(newGrid.getSize(), { width: 64, height: 12 });
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

  grid.set(63, 9);
  {
    const rect = grid.getBoundingBox();
    assertEquals(rect, {
      maxX: 63,
      minX: 2,
      maxY: 9,
      minY: 5,
    });
  }
});

Deno.test("BitGrid getBoundingBox 3", () => {
  const grid = BitGrid.make({ width: 32, height: 32 });
  grid.set(0, 0);
  assertEquals(grid.getBoundingBox(), {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  });
  grid.set(1, 0);
  assertEquals(grid.getBoundingBox(), {
    minX: 0,
    minY: 0,
    maxX: 1,
    maxY: 0,
  });
});

Deno.test("BitGrid getTopRowLeftCellPosition", () => {
  {
    const grid = BitGrid.make({ width: 64, height: 8 });
    assertEquals(grid.getTopRowLeftCellPosition(), null);
    grid.set(1, 0);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 1, y: 0 });
    grid.set(0, 1);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 1, y: 0 });
  }

  {
    const grid = BitGrid.make({ width: 64, height: 8 });
    assertEquals(grid.getTopRowLeftCellPosition(), null);
    grid.set(3, 4);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 3, y: 4 });
    grid.set(3, 3);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 3, y: 3 });
  }

  {
    const grid = BitGrid.make({ width: 64, height: 8 });
    assertEquals(grid.getTopRowLeftCellPosition(), null);
    grid.set(3, 4);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 3, y: 4 });
    grid.set(2, 4);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 2, y: 4 });
  }

  {
    const grid = BitGrid.make({ width: 64, height: 8 });
    assertEquals(grid.getTopRowLeftCellPosition(), null);
    grid.set(35, 4);
    assertEquals(grid.getTopRowLeftCellPosition(), { x: 35, y: 4 });
  }
});

Deno.test("BitGrid isSamePatternIgnoreTranslation", () => {
  const w = 64;
  const h = 64;

  // --- Test 1: Empty Grids ---
  const g1 = BitGrid.make({ width: w, height: h });
  const g2 = BitGrid.make({ width: w, height: h });
  assertEquals(
    g1.isSamePatternIgnoreTranslation(g2),
    true,
    "T1: Empty grids should match.",
  );

  // --- Test 2: Identical Position (No Translation) ---
  g1.set(10, 10);
  g1.set(11, 10);
  g2.set(10, 10);
  g2.set(11, 10);
  assertEquals(
    g1.isSamePatternIgnoreTranslation(g2),
    true,
    "T2: Identical pattern at same position.",
  );

  // --- Test 3: Simple Translation (Match) ---
  const g3 = BitGrid.make({ width: w, height: h });
  g3.set(20, 30); // TopLeft(20, 30)
  g3.set(21, 30);
  assertEquals(
    g1.isSamePatternIgnoreTranslation(g3),
    true,
    "T3: Identical pattern with translation.",
  );

  // --- Test 4: More Complex Pattern (Glider) ---
  const gliderA = BitGrid.make({ width: w, height: h });
  // TopLeft (1, 0)
  gliderA.setAll(([
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ] as const).map(([x, y]) => ({ x, y })));

  const gliderB = BitGrid.make({ width: w, height: h });
  // TopLeft (10, 5)
  gliderB.setAll(([
    [10, 5],
    [11, 6],
    [9, 7],
    [10, 7],
    [11, 7],
  ] as const).map(([x, y]) => ({ x, y })));

  assertEquals(
    gliderA.isSamePatternIgnoreTranslation(gliderB),
    true,
    "T4: Glider pattern match with translation.",
  );

  // --- Test 5: Mismatch (Different Population) ---
  gliderB.set(50, 50); // Add one extra cell
  assertEquals(
    gliderA.isSamePatternIgnoreTranslation(gliderB),
    false,
    "T5: Mismatch due to different population.",
  );
  gliderB.clear();

  // --- Test 6: Mismatch (Same Population, Different Shape) ---
  // A: Glider (Pop 5)
  // C: 5 cells in a column (Pop 5)
  const gC = BitGrid.make({ width: w, height: h });
  gC.setAll(([
    [10, 10],
    [10, 11],
    [10, 12],
    [10, 13],
    [10, 14],
  ] as const).map(([x, y]) => ({ x, y })));

  assertEquals(
    gliderA.getPopulation(),
    gC.getPopulation(),
    "Populations should be equal (5)",
  );
  assertEquals(
    gliderA.isSamePatternIgnoreTranslation(gC),
    false,
    "T6: Mismatch due to different shape.",
  );

  // --- Test 7: Boundary Condition Match (Near edge) ---
  const edgeA = BitGrid.make({ width: w, height: h });
  edgeA.set(62, 62); // TopLeft (62, 62)
  edgeA.set(63, 63);

  const edgeB = BitGrid.make({ width: w, height: h });
  edgeB.set(0, 0); // TopLeft (0, 0)
  edgeB.set(1, 1);
  // dx = 0 - 62 = -62. dy = 0 - 62 = -62.
  // edgeA(62, 62) -> check edgeB(62-62, 62-62) = edgeB(0, 0). Match.
  // edgeA(63, 63) -> check edgeB(63-62, 63-62) = edgeB(1, 1). Match.
  assertEquals(
    edgeA.isSamePatternIgnoreTranslation(edgeB),
    true,
    "T7: Boundary Match",
  );

  // --- Test 8: Boundary Condition Mismatch (Partially out of bounds after shift) ---
  const edgeC = BitGrid.make({ width: w, height: h });
  edgeC.set(1, 1); // TopLeft (1, 1)

  const edgeD = BitGrid.make({ width: 3, height: 3 });
  edgeD.set(0, 0);

  // Set up edge case where the pattern is shifted near the top-left boundary of the grid.
  // edgeA: (62, 62) (TopLeft: 62, 62)
  // edgeD: (0, 0) (TopLeft: 0, 0) -> Pop 1.
  // Pop 2 != Pop 1. -> False (Correct)
  assertEquals(
    edgeA.isSamePatternIgnoreTranslation(edgeD),
    false,
    "T8a: Boundary Mismatch (Pop)",
  );

  edgeD.clear();
  edgeD.set(0, 0); // Pop 1. TopLeft (0, 0)
  edgeA.clear();
  edgeA.set(50, 50); // Pop 1. TopLeft (50, 50)

  // Match check: edgeA.isSamePatternIgnoreTranslation(edgeD)
  // Pop is 1. Match.
  // dx = 0 - 50 = -50. dy = 0 - 50 = -50.
  // edgeA(50, 50) -> check edgeD(50-50, 50-50) = edgeD(0, 0). Match.
  assertEquals(
    edgeA.isSamePatternIgnoreTranslation(edgeD),
    true,
    "T8b: Boundary Match (Single Cell)",
  );
});
