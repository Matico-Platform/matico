use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::Validate;
use wasm_bindgen::prelude::*;
use crate::{PaneRef, Layout};


#[wasm_bindgen]
#[derive(Default, Debug, Validate, Serialize, Deserialize, Clone,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct Page {
    name: String,
    icon: Option<String>,
    panes: Vec<PaneRef>,
    path: Option<String>,
    layout: Layout 
}

#[wasm_bindgen]
impl Page {
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter= name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    #[wasm_bindgen(getter = path)]
    pub fn get_path(&self) -> Option<String> {
        self.path.clone()
    }

    #[wasm_bindgen(setter= path)]
    pub fn set_path(&mut self, path: String) {
        self.path = Some(path);
    }

    #[wasm_bindgen(getter = icon)]
    pub fn get_icon(&self) -> Option<String> {
        self.icon.clone()
    }

    #[wasm_bindgen(setter= icon)]
    pub fn set_icon(&mut self, icon: String) {
        self.icon = Some(icon);
    }

    pub fn add_pane(&mut self, pane_type:&str, pane_id:&str){
        let pane_ref:PaneRef = (pane_type,pane_id).try_into().unwrap();
        self.panes.push(pane_ref.into());
    }
     
    pub fn add_pane_before(&mut self, before_pane_id: &str, pane_type: &str, pane_id: &str){
       let pane_ref :PaneRef = (pane_type,pane_id).try_into().unwrap();
       let before_pane_pos = self.panes.iter().position(|p| p.id() == before_pane_id).unwrap();
       self.panes.insert(before_pane_pos, pane_ref)
    }

    pub fn add_pane_after(&mut self, after_pane_id: &str, pane_type: &str, pane_id: &str){
       let pane_ref :PaneRef = (pane_type,pane_id).try_into().unwrap();
       let after_pane_pos= self.panes.iter().position(|p| p.id() == after_pane_id).unwrap();
       self.panes.insert(after_pane_pos+1, pane_ref)
    }

    pub fn move_pane_to_position(&mut self, pane_id:&str, new_pos: usize){
        let pos= self.panes.iter().position(|p| p.id()== pane_id).unwrap();
        let pane = self.panes.remove(pos);
        if new_pos <= pos {
            self.panes.insert(new_pos,pane);
        }
        else{
           self.panes.insert(new_pos -1, pane) 
        }
    }

    pub fn add_pane_at_position(&mut self,pane_type: &str, pane_id:&str, index: usize){
       let pane_ref :PaneRef = (pane_type,pane_id).try_into().unwrap();
        self.panes.insert(index,pane_ref);
    }

    pub fn remove_pane_at_position(&mut self, index: usize){
        self.panes.remove(index);
    }

    pub fn remove_pane(&mut self, pane_id: &str){
        self.panes.retain(|pane| pane.id() == pane_id );
    }
}
