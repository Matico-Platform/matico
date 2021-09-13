use serde::{Serialize,Deserialize};
use validator::{Validate};
use wasm_bindgen::prelude::*;
use crate::PanePosition;

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug, Copy,Clone)]
pub struct ChartPane{
    #[validate]
    pub position: PanePosition,
}

