mod autocomplete;
mod charts;
mod dashboard;
mod mapping;
mod page;
mod pane;
mod section;
mod validation;
mod variables;

use autocomplete::*;
use charts::*;
use dashboard::*;
use mapping::*;
use page::*;
use pane::*;
use section::*;
use validation::*;
use variables::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests {
    use super::*;
}
