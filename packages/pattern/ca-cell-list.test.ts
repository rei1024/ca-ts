import { CACellList } from "./mod.ts";
import { assertEquals, assertThrows } from "@std/assert";

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

Deno.test("CACellList getCells remove duplicated position", () => {
  const cells = [
    { position: { x: 1, y: 1 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  const cellList = CACellList.fromCells(cells);

  const expectedSortedCells = [
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  assertEquals(cellList.getCells(), expectedSortedCells);
});

Deno.test("CACellList population remove duplicated position", () => {
  const cells = [
    { position: { x: 1, y: 1 }, state: 1 },
    { position: { x: 1, y: 0 }, state: 1 },
    { position: { x: 1, y: 1 }, state: 1 },
  ];

  const cellList = CACellList.fromCells(cells);
  assertEquals(cellList.population, 2);
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
    offset: { dx: 0, dy: 0 },
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
    offset: { dx: 0, dy: 0 },
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
    offset: { dx: 0, dy: -1 },
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
    offset: { dx: 0, dy: 0 },
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
    offset: { dx: 0, dy: 0 },
    array: [
      [2, 1, 2],
      [2, 2, 1],
      [1, 1, 1],
    ],
  });
});

Deno.test("CACellList from2dArray", () => {
  const array = [
    [0, 0],
    [0, 5],
  ];
  const cellList = CACellList.from2dArray(array);
  assertEquals(cellList.getCells(), [
    { position: { x: 1, y: 1 }, state: 5 },
  ]);
});

Deno.test("CACellList to2dArray throws", () => {
  const cellList = CACellList.fromCells([{
    state: 1,
    position: { x: Infinity, y: Infinity },
  }]);
  assertThrows(() => {
    cellList.to2dArray();
  }, "invalid position");
});

Deno.test("CACellList to2dArray from2dArray", () => {
  for (let i = 0; i < 200; i++) {
    const width = randomInt(1, 10);
    const height = randomInt(1, 10);
    const count = randomInt(1, width * height);
    const cellList = randomCellList(width, height, count);
    const array = cellList.to2dArray()!;
    const newCellList = CACellList.from2dArray(array.array, array.offset);
    assertEquals(newCellList.getCells(), cellList.getCells());
  }
});

Deno.test("CACellList translate", () => {
  const cellList = CACellList.fromCells(glider);
  const translatedCellList = cellList.translate({ dx: 1, dy: 2 });
  const expectedCells = [
    { position: { x: 2, y: 2 }, state: 1 },
    { position: { x: 3, y: 3 }, state: 1 },
    { position: { x: 1, y: 4 }, state: 1 },
    { position: { x: 2, y: 4 }, state: 1 },
    { position: { x: 3, y: 4 }, state: 1 },
  ];
  assertEquals(translatedCellList.getCells(), expectedCells);
  assertEquals(translatedCellList.to2dArray(), {
    size: { width: 3, height: 3 },
    offset: { dx: 1, dy: 2 },
    array: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  });
});

Deno.test("CACellList equals", () => {
  const cellList1 = CACellList.fromCells(glider);

  assertEquals(cellList1.equals(cellList1), true);

  const cellList2 = CACellList.fromCells(glider);
  assertEquals(cellList1.equals(cellList2), true);

  const cellList3 = CACellList.fromCells(glider.map((cell) => ({
    ...cell,
    state: cell.state + 1,
  })));
  assertEquals(cellList1.equals(cellList3), false);

  const cellList4 = CACellList.fromCells(glider.concat([
    { position: { x: 3, y: 3 }, state: 1 },
  ]));

  assertEquals(cellList1.equals(cellList4), false);
});

// Deno.test("CACellList union", () => {
//   const cellList = CACellList.fromCells(glider);
//   const translatedCellList = cellList.translate({ dx: 1, dy: 2 });
//   const unionCellList = cellList.union(translatedCellList);
// });

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCellList(width: number, height: number, count: number) {
  const cells = [];
  for (let i = 0; i < count; i++) {
    cells.push({
      position: {
        x: randomInt(0, width - 1),
        y: randomInt(0, height - 1),
      },
      state: randomInt(1, 10),
    });
  }
  return CACellList.fromCells(cells);
}
