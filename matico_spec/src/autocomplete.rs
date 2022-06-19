use crate::*;
use matico_common::AutoComplete;

pub fn autocomplete(expression: &str) -> Option<String> {
    match expression {
        "App" => Some(App::autocomplete_json()),
        "Map" => Some(MapPane::autocomplete_json()),
        "Layer" => Some(Layer::autocomplete_json()),
        "Pane" => Some(Pane::autocomplete_json()),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use crate::*;

    #[test]
    fn test_autocomplete() {
        assert!(
            autocomplete("Dashboard").is_some(),
            "failed to autocomplete dashboard"
        );
        assert!(
            autocomplete("Pane").is_some(),
            "failed to autocomplete dashboard"
        );
        assert!(
            autocomplete("blsh").is_none(),
            "autocompleted to something when the string was not in the list of autocompletes"
        );

        println!("ac {:?}", autocomplete("Pane").unwrap());
    }
}
