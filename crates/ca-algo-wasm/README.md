```sh
cargo install wasm-bindgen-cli
rustup target add wasm32-unknown-unknown
```

```sh
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen ./target/wasm32-unknown-unknown/release/ca_algo_wasm.wasm --out-dir dist --target web
```

```sh
deno run --allow-net --allow-read jsr:@std/http/file-server
```
