import { parseRLE } from "@ca-ts/rle";
import { parseRule } from "@ca-ts/rule";
import { IntWorld } from "./mod.ts";

Deno.test("IntWorld", () => {
  // https://conwaylife.com/forums/viewtopic.php?f=11&t=5654#p145420
  const rle = parseRLE(
    `x = 36, y = 36, rule = B3-cnqy5cek/S2-ci3-ay4ceinrtz5-aiqy6-ak7c8
10$28bo$26b5o$26bobobo$10b2o$9bobo3bobo$9bo$9bo6bo$12bo$11b2o4b3o$9b3o
5bo3bo$9bo10b2o$9bo2b4o4bo2bobo$10b6o7b2o$12bobo4$18b2o$17bo2bo$16b2o
2bo$17b2o2bo$18b4o$12bobobo$12b5o$14bo!
`,
  );

  const rule = parseRule(`B3-cnqy5cek/S2-ci3-ay4ceinrtz5-aiqy6-ak7c8`);
  if (rule.type !== "int") {
    throw new Error("errro");
  }

  const world = new IntWorld(64, 64, rule.transition);

  for (const cell of rle.cells) {
    world.set(cell.position.x, cell.position.y);
  }

  const initialWorld = world.clone();
  for (let i = 0; i < 232; i++) {
    world.next();
  }

  if (!world.equal(initialWorld)) {
    throw new Error("not oscillator");
  }
});
