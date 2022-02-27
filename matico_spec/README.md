# MaticoSpec 

The MaticoSpec defines how we specify an MaticoApp, from what panes should be on what pages to what datasets should be loaded and from where. The specification is written in Rust to ensure that we have a strickly specified and typechecked specification. Most users and developers will interact with the spec using language specific tools built on top of the rust code. For example, when building a frontend cpplication, the spec produces TypescriptTypes for each of it's components along with a WASM based validation function for each. See below for exampels 


## Building the spec for use in Rust 

To build the specification library for use in Rust, first [install Rust](https://postgis.net/install/), then run 

```bash
cargo build 
```

## Testing

We are working on expanding the test suite around the specification. To run the existing tests, simply run 

```bash
cargo test 
```

## Building the WASM library 

To generate the javacsript module that allows you to interact with the spec in javascript, you will first need to install wasm-pack, then run

```
wasm-pack build --scope=maticoapp
```

this will produce a pkg directory with the javascript module.

## Using the javascript / wasm module 

To use the module you will need to

1. Add @maticoapp/matico\_spec to your project dependencies 

```bash
yarn add @maticoapp/matico_spec 

```

then import the WASM module. This might vary a little dending on what build system you are using. You can see an example of how to do this in the MaticoComponents project in the useValidator hook


```typescript 
import { useEffect, useState } from 'react'

export const useValidator = () => {
  const [validator, setValidator] = useState<any>(null)
  const [validatorReady, setValidatorReady] = useState<boolean>(false)
  const [error, setError] = useState<any | undefined>(undefined)

  useEffect(() => {
    let f = async () => {
      try {
        const wasm = await import( /*webpackChunkName:"spec"*/ '@maticoapp/matico_spec');
        setValidator(wasm)
        setValidatorReady(true)
      } catch (err) {
        setError(`failed to load wasm: ${err}`)
        console.log("unexpected error in load wasm ", err);
      }
    };
    f();
  }, []);
  return { validator, validatorReady, error }
```

You can also just install @maticoapp/matico\_components and use the hook directly.


