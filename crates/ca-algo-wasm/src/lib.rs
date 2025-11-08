
use wasm_bindgen::prelude::*;

// Export a `greet` function from Rust to JavaScript, that alerts a
// hello message.
#[wasm_bindgen]
pub fn greet(name: &str) -> u8 {
  33
}

#[wasm_bindgen]
pub struct BitGrid {
  width: usize,
  height: usize,
  data: Vec<u32>,
}

#[wasm_bindgen]
impl BitGrid {
  #[wasm_bindgen(constructor)]
  pub fn new(width: usize, height: usize) -> BitGrid {
    BitGrid {
      width,
      height,
      data: vec![0; width * height],
    }
  }

  #[wasm_bindgen]
  pub fn get_internal_data(&self) -> Vec<u32> {
    self.data.clone()
  }
}
