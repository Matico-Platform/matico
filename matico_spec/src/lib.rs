mod autocomplete;
mod charts;
mod controls;
mod apps;
mod datasets;
mod mapping;
mod page;
mod pane;
mod theme;
mod validation;
mod colors;
mod layouts;

pub use autocomplete::*;
pub use charts::*;
pub use controls::*;
pub use apps::*;
pub use datasets::*;
pub use mapping::*;
pub use page::*;
pub use pane::*;
pub use theme::*;
pub use validation::*;
pub use matico_common::*;
pub use colors::*;
pub use layouts::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests {
    use super::*;
}
