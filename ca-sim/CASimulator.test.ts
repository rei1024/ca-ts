import { CASimulator } from "./mod.ts";
import { parseRLE } from "../rle/mod.ts";
import { assertEquals } from "@std/assert";

function makeCGoL() {
  return new CASimulator({
    transitionRule: ({
      center,
      ne,
      n,
      nw,
      e,
      w,
      se,
      s,
      sw,
    }) => {
      const outerCount = ne + n + nw + e + w + se + s + sw;
      if (center === 0 && outerCount === 3) {
        return 1;
      } else if (center === 1 && (outerCount === 2 || outerCount === 3)) {
        return 1;
      } else {
        return 0;
      }
    },
  });
}

function readRLE(ca: CASimulator, rle: string) {
  const { cells } = parseRLE(rle);
  for (const cell of cells) {
    ca.offsetArray.setCell(cell.position, cell.state);
  }
}

Deno.test("CASimulator galaxy", () => {
  const ca = makeCGoL();
  readRLE(
    ca,
    `#N Kok's galaxy
#O Jan Kok
#C A period 8 oscillator that was found in 1971.
#C www.conwaylife.com/wiki/index.php?title=Kok's_galaxy
x = 9, y = 9, rule = 23/3
2bo2bobob$2obob3ob$bo6bo$2o5bob2$bo5b2o$o6bob$b3obob2o$bobo2bo!`,
  );
  assertEquals(ca.getPopulation(), 28);
  for (let i = 0; i < 16; i++) {
    ca.next();
  }
  assertEquals(ca.getPopulation(), 28);
  assertEquals(ca.getGeneration(), 16);
});

Deno.test.ignore("CASimulator r", () => {
  const ca = makeCGoL();
  readRLE(
    ca,
    `#N R-pentomino
#C A methuselah with lifespan 1103.
#C www.conwaylife.com/wiki/index.php?title=R-pentomino
x = 3, y = 3, rule = B3/S23
b2o$2ob$bo!`,
  );

  ca.nextN(1103);

  assertEquals(ca.getPopulation(), 116);
  assertEquals(ca.getGeneration(), 1103);
});
