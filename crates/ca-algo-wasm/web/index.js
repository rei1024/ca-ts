import { BitGrid, initSync } from "../dist/ca_algo_wasm.js";

const mod = await fetch("../dist/ca_algo_wasm_bg.wasm").then((response) =>
  response.arrayBuffer()
);

const wasm = initSync({ module: mod });

const result = wasm.greet("World");
console.log("WASM greet result:", result);

const bitGrid = new BitGrid(10, 10);
console.log(bitGrid);
console.log(bitGrid.get_internal_data());
