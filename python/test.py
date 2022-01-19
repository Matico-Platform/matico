from wasmtime import Engine, Store, Module, Instance, Func, FuncType

engine = Engine()
store = Store()
module = Module.from_file(engine,'../target/wasm32-unknown-unknown/release/matico_spec.wasm')
instance = Instance(store,module,[])
print_hello = instance.get_export("hello")
print_hello()
