/* cSpell:disable */

import { assertEquals } from "@std/assert";
import { BitWorld } from "../BitWorld.ts";
import { World } from "./world.ts";
import { parseRule } from "../../../rule/mod.ts";
import { parseRLE } from "../../../rle/mod.ts";
import { parseIntRule } from "../../../rule/lib/int/moore/parse-int.ts";
import { parseMapRule } from "../../../rule/lib/map/parse-map.ts";
import { TEST_MAP_CGOL } from "../../../rule/lib/map/parse-map.test.ts";

function d(a: BitWorld) {
  return a.getArray().slice(0, 4).map((r) => r.slice(0, 4).join(""));
}

Deno.test("BitWorld is correct block", () => {
  const bitWorld = BitWorld.make({ width: 32, height: 32 });

  bitWorld.set(1, 1);
  bitWorld.set(1, 2);
  bitWorld.set(2, 1);
  bitWorld.set(2, 2);
  const before = d(bitWorld);

  bitWorld.next();

  assertEquals(
    d(bitWorld),
    before,
  );
});

Deno.test("BitWorld is correct", () => {
  const bitWorld = BitWorld.make({ width: 32 * 3, height: 32 });
  const world = new World(32 * 3, 32);

  randomCheck(bitWorld, world, 50);
});

Deno.test("BitWorld is correct 2", () => {
  const bitWorld = BitWorld.make({ width: 32 * 1, height: 32 });
  const world = new World(32 * 1, 32);
  randomCheck(bitWorld, world, 50);
});

Deno.test("BitWorld is correct OT rule", () => {
  // HighLife
  const transition = {
    birth: [3, 6],
    survive: [2, 3],
  };
  const bitWorld = BitWorld.make({ width: 32 * 2, height: 32 });
  bitWorld.setRule(transition);
  const world = new World(32 * 2, 32);
  world.setOTRule(transition);
  randomCheck(bitWorld, world, 50);
});

Deno.test("BitWorld is correct transition", () => {
  const bitWorld = BitWorld.make({ width: 32 * 1, height: 32 });
  bitWorld.setRule({
    birth: [3],
    survive: [2, 3],
  });
  const world = new World(32 * 1, 32);
  randomCheck(bitWorld, world, 50);
});

function randomCheck(bitWorld: BitWorld, world: World, generations: number) {
  bitWorld.forEach((x, y) => {
    if (Math.random() > 0.5) {
      bitWorld.set(x, y);
      world.set(x, y);
    }
  });

  for (let i = 0; i < generations; i++) {
    assertEquals(
      bitWorld.getArray(),
      world.getArray().map((x) => x.map((y) => Number(y))),
    );
    bitWorld.next();
    world.next();
  }
}

Deno.test("BitWorld is correct intTransition", () => {
  const world = BitWorld.make({ width: 64, height: 64 });

  // https://conwaylife.com/forums/viewtopic.php?f=11&t=5654#p145420
  const rle = parseRLE(
    `x = 36, y = 36, rule = B3-cnqy5cek/S2-ci3-ay4ceinrtz5-aiqy6-ak7c8
10$28bo$26b5o$26bobobo$10b2o$9bobo3bobo$9bo$9bo6bo$12bo$11b2o4b3o$9b3o
5bo3bo$9bo10b2o$9bo2b4o4bo2bobo$10b6o7b2o$12bobo4$18b2o$17bo2bo$16b2o
2bo$17b2o2bo$18b4o$12bobobo$12b5o$14bo!
  `,
  );

  for (const cell of rle.cells) {
    world.set(cell.position.x, cell.position.y);
  }

  const rule = parseRule(rle.ruleString);
  if (rule.type !== "int") {
    throw new Error("expected int rule");
  }

  world.setINTRule(rule.transition);
  const initialGrid = world.bitGrid.clone();
  for (let i = 0; i < 232; i++) {
    world.next();
  }

  if (!world.bitGrid.equal(initialGrid)) {
    throw new Error(`not a oscillator`);
  }
});

Deno.test("BitWorld is correct intTransition cgol", () => {
  const cgolAsINT = parseIntRule("B3/S23");
  const size = { width: 32 * 3, height: 32 };
  const bitWorld = BitWorld.make(size);
  bitWorld.setINTRule(cgolAsINT.transition);
  const world = new World(size.width, size.height);
  randomCheck(bitWorld, world, 20);
});

Deno.test("BitWorld is correct MAP cgol", () => {
  const cgolAsMAP = parseMapRule(TEST_MAP_CGOL);
  const size = { width: 32 * 3, height: 32 };
  const bitWorld = BitWorld.make(size);
  bitWorld.setMAPRule(cgolAsMAP.data);
  const world = new World(size.width, size.height);
  randomCheck(bitWorld, world, 20);
});
