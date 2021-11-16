mod autocomplete;
mod charts;
mod dashboard;
mod mapping;
mod page;
mod pane;
mod section;
mod validation;
mod variables;
mod datasets;
mod filters;

use autocomplete::*;
use charts::*;
use dashboard::*;
use mapping::*;
use page::*;
use pane::*;
use section::*;
use validation::*;
use variables::*;
use datasets::*;
use filters::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests {
    use super::*;
}
