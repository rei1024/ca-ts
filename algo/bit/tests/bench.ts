import { BitWorld } from "../mod.ts";
import { World } from "./world.ts";

const N = 1;
const M = 262;

const width = 32 * 1;
const height = 32 * 1;

Deno.bench({ name: "BitWorld cgol", group: "algo" }, () => {
  for (let j = 0; j < N; j++) {
    const bitWorld = BitWorld.make({ width, height }, {
      transition: { birth: [3], survive: [2, 3] },
    });
    bitWorld.forEach((x, y) => {
      if (Math.random() > 0.5) {
        bitWorld.set(x, y);
      }
    });

    for (let i = 0; i < M; i++) {
      bitWorld.next();
    }
  }
});

Deno.bench({ name: "BitWorld outer totalistic", group: "algo" }, () => {
  for (let j = 0; j < N; j++) {
    const bitWorld = BitWorld.make({ width, height }, {
      transition: { birth: [2, 3], survive: [2, 3] },
    });
    bitWorld.forEach((x, y) => {
      if (Math.random() > 0.5) {
        bitWorld.set(x, y);
      }
    });

    for (let i = 0; i < M; i++) {
      bitWorld.next();
    }
  }
});

Deno.bench({ name: "BitWorld Int", group: "algo" }, () => {
  for (let j = 0; j < N; j++) {
    const bitWorld = BitWorld.make({ width, height }, {
      intTransition: {
        birth: [
          "3e",
          "3k",
          "3a",
          "3i",
          "3j",
          "3r",
          "5c",
          "5e",
          "5k",
        ],
        survive: [
          "2e",
          "2k",
          "2a",
          "2n",
          "3c",
          "3e",
          "3k",
          "3i",
          "3n",
          "3q",
          "3j",
          "3r",
          "4c",
          "4e",
          "4i",
          "4n",
          "4r",
          "4t",
          "4z",
          "5c",
          // "5e",
          // "5k",
          // "5n",
          // "5j",
          // "5r",
          // "6c",
          // "6e",
          // "6i",
          // "6n",
          // "7c",
          // "8",
        ],
      },
    });
    bitWorld.forEach((x, y) => {
      if (Math.random() > 0.5) {
        bitWorld.set(x, y);
      }
    });

    for (let i = 0; i < M; i++) {
      bitWorld.next();
    }
  }
});

Deno.bench({ name: "World", group: "algo" }, () => {
  for (let j = 0; j < N; j++) {
    const world = new World(width, height);
    world.forEach((x, y) => {
      if (Math.random() > 0.5) {
        world.set(x, y);
      }
    });

    for (let i = 0; i < M; i++) {
      world.next();
    }
  }
});

let value = 0;
let sum = false;

Deno.bench({ name: "bit op expr", group: "bit op" }, () => {
  const BITS = 32;
  const BITS_MINUS_1 = BITS - 1;

  value = value === 1 ? 0 : 1;

  for (let j = 0; j < BITS; j++) {
    const alive = (1 << (BITS_MINUS_1 - j)) !== 0;
    if (alive) {
      sum = sum || alive;
    }
  }
});

Deno.bench({ name: "bit op mut", group: "bit op" }, () => {
  const BITS = 32;
  const BITS_MINUS_1 = BITS - 1;

  value = value === 1 ? 0 : 1;

  let bitMask = 1 << BITS_MINUS_1;
  for (let u = 0; u < BITS; u++) {
    if ((value & bitMask) !== 0) {
      sum = sum || true;
    }
    bitMask >>>= 1;
  }
});
