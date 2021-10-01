# Matico Spec

This repo is a playground to expore defining a spec for Matico in Rust and exposing it through Typescript and WASM. The benifits this hopefully gives 

- ability to plug in to Rusts excelent serde system to serialize and deserialize the spec to muliple formats (JSON, TOML, YAML etc)
- strict validation through the validation crate
- a single source of truth from the spec which can be used in js, python, r, rust etc through wasm (some issues here but hopeful that they are resolveable)
- strict typing.

## Running the playground 

The code is in two parts, the spec it'self and a react based editor. 

to get running 

- Install rust + cargo: https://www.rust-lang.org/tools/install
- Install wasm-pack : https://rustwasm.github.io/wasm-pack/installer/

run 
```
wasm-pack build 
```

This will produce a pkg file which contains the compiled spec as wasm and include the js and ts bindings 

Then you can run the editor which lives in wasm_test simply using yarn or npm

```
cd wasm_test 
yarn 
yarn start
```
