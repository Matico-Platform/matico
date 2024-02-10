use std::collections::HashMap;

use wasmer::imports;
use wasmer::{Instance, Module, Store, Value};

use wai_bindgen_wasmer::{export, import};

wai_bindgen_wasmer::export!("plugin_interface/plugin_imports.wai");
wai_bindgen_wasmer::import!("plugin_interface/plugin_exports.wai");

pub struct PluginSupport {
    cache: HashMap<String, Vec<u8>>,
}

impl plugin_imports::PluginImports for PluginSupport {
    fn log(&mut self, test: &str) -> () {
        println!("Loggin {}", test);
    }
    fn set_cache_value(&mut self, key: &str, value: &[u8]) {
        self.cache.insert(key.into(), value.into());
    }
    fn get_cache_value(&mut self, key: &str) -> Option<Vec<u8>> {
        self.cache.get(key.into()).cloned()
    }
}

pub struct Plugin {
    store: Store,
    plugin: plugin_exports::PluginExports,
    plugin_instance: plugin_exports::Plugin,
}

impl Plugin {
    pub fn new(module: &Module) -> anyhow::Result<Self> {
        let mut imports = imports! {};
        let mut store = Store::default();
        let plugin_support = PluginSupport {
            cache: HashMap::new(),
        };

        let add_imports = plugin_imports::add_to_imports(&mut store, &mut imports, plugin_support);

        let (plugin, instance) =
            plugin_exports::PluginExports::instantiate(&mut store, &module, &mut imports)?;

        add_imports(&instance, &mut store)?;

        let plugin_instance = plugin.new_plugin(&mut store)?;

        Ok(Self {
            store,
            plugin_instance,
            plugin,
        })
    }

    pub fn options(&mut self) -> Vec<plugin_exports::Input> {
        self.plugin.options(&mut self.store).unwrap()
    }

    pub fn set_patameter(&mut self, key: String, value: plugin_exports::Variable) {
        self.plugin
            .plugin_set_input(&mut self.store, &self.plugin_instance, &key, value);
    }

    pub fn set_table(&mut self, key: String, value: &[u8]) {
        self.plugin
            .plugin_register_table(&mut self.store, &self.plugin_instance, &key, value);
    }
}
