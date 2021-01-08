table! {
    users (id) {
        id -> Int4,
        username -> Text,
        created_at -> Timestamp,
    }
}

allow_tables_to_appear_in_same_query!(
    users,
);
