
use wasm_bindgen::prelude::*;

// Export a `greet` function from Rust to JavaScript, that alerts a
// hello message.
#[wasm_bindgen]
pub fn greet(name: &str) -> u8 {
  33
}

#[wasm_bindgen]
pub struct BitGrid {
  word_width: usize,
  height: usize,
  data: Vec<u32>,
}

#[wasm_bindgen]
impl BitGrid {
  #[wasm_bindgen(constructor)]
  pub fn new(word_width: usize, height: usize, data: Vec<u32>) -> BitGrid {
    if data.len() != word_width * height {
      panic!("Data length does not match word_width * height");
    }

    BitGrid {
      word_width,
      height,
      data,
    }
  }

  #[wasm_bindgen]
  pub fn get_internal_data(&self) -> Vec<u32> {
    self.data.clone()
  }

  #[wasm_bindgen]
  pub fn set_internal_data(&mut self, data: Vec<u32>) {
    if data.len() != self.word_width * self.height {
      panic!("Data length does not match word_width * height");
    }
    self.data = data;
  }

  #[wasm_bindgen]
  pub fn get_word_width(&self) -> usize {
    self.word_width
  }

  #[wasm_bindgen]
  pub fn get_height(&self) -> usize {
    self.height
  }

  #[wasm_bindgen]
  pub fn population_count(&self) -> u32 {
    self.data.iter().map(|word| word.count_ones()).sum()
  }
}
