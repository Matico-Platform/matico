~~ # Add layers to mapping struct (done )
not sure why but something seems to require copy to be present prob pub on wasm_bindgen might need to create a getter setter for layers instead ~~

# Notes for getting toml serialziation working

Getting enaums working with serde and toml https://github.com/serde-rs/serde/issues/725


# Implement a type <T> for autocomplete to return either a String or JsValue


# Build
`wasm-pack build --scope maticoapp`