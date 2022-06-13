mod autocomplete;
mod charts;
mod controls;
mod dashboard;
mod datasets;
mod mapping;
mod page;
mod pane;
mod section;
mod theme;
mod validation;
mod colors;

pub use autocomplete::*;
pub use charts::*;
pub use controls::*;
pub use dashboard::*;
pub use datasets::*;
pub use mapping::*;
pub use page::*;
pub use pane::*;
pub use section::*;
pub use theme::*;
pub use validation::*;
pub use matico_common::*;
pub use colors::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests {
    use super::*;
}
