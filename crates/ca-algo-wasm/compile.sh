cargo build --target wasm32-unknown-unknown --release
wasm-bindgen ./target/wasm32-unknown-unknown/release/ca_algo_wasm.wasm --out-dir dist --target web
