use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct Column {
    pub name: String,
    pub col_type: String,
}
