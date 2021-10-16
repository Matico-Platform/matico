mod autocomplete;
mod charts;
mod dashboard;
mod mapping;
mod pane;
mod section;
mod validation;
mod page;

use autocomplete::*;
use charts::*;
use dashboard::*;
use mapping::*;
use pane::*;
use section::*;
use validation::*;
use page::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests {
    use super::*;
}
