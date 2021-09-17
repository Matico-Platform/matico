mod dashboard;
mod pane;
mod section;
mod validation;
mod mapping;
mod charts;
mod autocomplete;

use dashboard::*;
use pane::*;
use validation::*;
use mapping::*;
use section::*;
use charts::*;
use autocomplete::*;

#[macro_use]
extern crate matico_spec_derive;

#[cfg(test)]
mod tests{
    use super::*;
}
