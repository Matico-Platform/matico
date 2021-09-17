use serde::{Serialize,Deserialize};
use validator::{Validate};
use wasm_bindgen::prelude::*;
use crate::{PanePosition, AutoComplete};

#[wasm_bindgen]
#[derive(Default,Serialize,Deserialize,Validate,Debug, Copy,Clone, AutoCompleteMe)]
pub struct ChartPane{
    #[validate]
    pub position: PanePosition,
}


