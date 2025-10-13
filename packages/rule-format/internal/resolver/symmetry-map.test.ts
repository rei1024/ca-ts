import { symmetryMap } from "./symmetry-map.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("symmetryMap no duplicate", () => {
  const mooreList = Object.values(symmetryMap.Moore);
  for (const symmetry of mooreList) {
    const cellList = symmetry.map((x) => x.join(","));
    assertEquals(new Set(cellList).size, cellList.length);
  }
});

Deno.test("symmetryMap Moore.rotate4", () => {
  assertEquals(
    symmetryMap.Moore.rotate4.map((cells) => cells.join(",")),
    [
      "0,1,2,3,4,5,6,7,8",
      "0,3,4,5,6,7,8,1,2",
      "0,5,6,7,8,1,2,3,4",
      "0,7,8,1,2,3,4,5,6",
    ],
  );
});

Deno.test("symmetryMap Moore.rotate4reflect", () => {
  assertEquals(
    symmetryMap.Moore.rotate4reflect.map((cells) => cells.join(",")),
    [
      "0,1,2,3,4,5,6,7,8",
      "0,3,4,5,6,7,8,1,2",
      "0,5,6,7,8,1,2,3,4",
      "0,7,8,1,2,3,4,5,6",
      "0,1,8,7,6,5,4,3,2",
      "0,7,6,5,4,3,2,1,8",
      "0,5,4,3,2,1,8,7,6",
      "0,3,2,1,8,7,6,5,4",
    ],
  );
});

Deno.test("symmetryMap Moore.rotate8", () => {
  assertEquals(
    symmetryMap.Moore.rotate8.map((cells) => cells.join(",")),
    [
      "0,1,2,3,4,5,6,7,8",
      "0,2,3,4,5,6,7,8,1",
      "0,3,4,5,6,7,8,1,2",
      "0,4,5,6,7,8,1,2,3",
      "0,5,6,7,8,1,2,3,4",
      "0,6,7,8,1,2,3,4,5",
      "0,7,8,1,2,3,4,5,6",
      "0,8,1,2,3,4,5,6,7",
    ],
  );
});
