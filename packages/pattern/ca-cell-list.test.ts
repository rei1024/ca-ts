import { CACellList } from "./mod.ts";
import { assertEquals } from "@std/assert";

Deno.test("CACellList getCells", () => {
  const cells = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 0, y: 1 }, state: 1 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  const cellList = CACellList.fromCells(cells);

  const expectedSortedCells = [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 0, y: 1 }, state: 1 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  assertEquals(cellList.getCells(), expectedSortedCells);
});

Deno.test("CACellList getCells remove zero state", () => {
  const cells = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 0, y: 1 }, state: 0 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  const cellList = CACellList.fromCells(cells);

  const expectedSortedCells = [
    { position: { x: 0, y: 0 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  assertEquals(cellList.getCells(), expectedSortedCells);
});

Deno.test("CACellList to2dArray 2x2", () => {
  const cells = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 0, y: 0 }, state: 2 },
    { position: { x: 0, y: 1 }, state: 3 },
    { position: { x: 1, y: 1 }, state: 4 },
  ];

  const cellList = CACellList.fromCells(cells);

  assertEquals(cellList.to2dArray(), {
    array: [
      [2, 1],
      [3, 4],
    ],
    size: { width: 2, height: 2 },
    offset: { x: 0, y: 0 },
  });
});

Deno.test("CACellList to2dArray 2x3", () => {
  const cells = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 0, y: 0 }, state: 2 },
    { position: { x: 2, y: 0 }, state: 5 },
    { position: { x: 0, y: 1 }, state: 3 },
    { position: { x: 1, y: 1 }, state: 4 },
    { position: { x: 2, y: 1 }, state: 6 },
  ];

  const cellList = CACellList.fromCells(cells);

  assertEquals(cellList.to2dArray(), {
    array: [
      [2, 1, 5],
      [3, 4, 6],
    ],
    size: { width: 3, height: 2 },
    offset: { x: 0, y: 0 },
  });
});

Deno.test("CACellList to2dArray negative", () => {
  const cells = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 0, y: -1 }, state: 2 },
  ];

  const cellList = CACellList.fromCells(cells);

  assertEquals(cellList.to2dArray(), {
    array: [
      [2, 0],
      [0, 1],
    ],
    size: { width: 2, height: 2 },
    offset: { x: 0, y: -1 },
  });
  assertEquals(cellList.boundingRect?.maxX, 1);
  assertEquals(cellList.boundingRect?.maxY, 0);
});

const glider = [
  { position: { x: 1, y: 0 }, state: 1 },
  { position: { x: 2, y: 1 }, state: 1 },
  { position: { x: 0, y: 2 }, state: 1 },
  { position: { x: 1, y: 2 }, state: 1 },
  { position: { x: 2, y: 2 }, state: 1 },
];

Deno.test("CACellList to2dArray glider", () => {
  assertEquals(CACellList.fromCells(glider).to2dArray(), {
    size: { width: 3, height: 3 },
    offset: { x: 0, y: 0 },
    array: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  });
});

Deno.test("CACellList to2dArray glider backgroundState", () => {
  assertEquals(CACellList.fromCells(glider).to2dArray({ backgroundState: 2 }), {
    size: { width: 3, height: 3 },
    offset: { x: 0, y: 0 },
    array: [
      [2, 1, 2],
      [2, 2, 1],
      [1, 1, 1],
    ],
  });
});
