mod apps;
mod autocomplete;
mod charts;
mod colors;
mod controls;
mod dataset_transforms;
mod datasets;
mod layouts;
mod mapping;
mod page;
mod pane;
mod theme;
mod validation;

pub use apps::*;
pub use autocomplete::*;
pub use charts::*;
pub use colors::*;
pub use controls::*;
pub use dataset_transforms::*;
pub use datasets::*;
pub use layouts::*;
pub use mapping::*;
pub use matico_common::*;
pub use page::*;
pub use pane::*;
pub use theme::*;
pub use validation::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(test)]
mod tests {
    use super::*;
}
