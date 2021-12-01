mod autocomplete;
mod charts;
mod controls;
mod dashboard;
mod datasets;
mod filters;
mod mapping;
mod page;
mod pane;
mod section;
mod validation;
mod variables;
mod theme;

use autocomplete::*;
use charts::*;
use controls::*;
use dashboard::*;
use datasets::*;
use filters::*;
use mapping::*;
use page::*;
use pane::*;
use section::*;
use validation::*;
use variables::*;
use theme::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests {
    use super::*;
}
