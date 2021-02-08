table! {
    datasets (id) {
        id -> Uuid,
        owner_id -> Uuid,
        name -> Text,
        original_filename -> Text,
        original_type -> Text,
        sync_dataset -> Bool,
        sync_url -> Nullable<Text>,
        sync_frequency_seconds -> Nullable<Int8>,
        post_import_script -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        public -> Bool,
        description -> Text,
        geom_col -> Text,
        id_col -> Text,
    }
}

table! {
    queries (id) {
        id -> Uuid,
        name -> Text,
        description -> Text,
        sql -> Text,
        parameters -> Jsonb,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

table! {
    spatial_ref_sys (srid) {
        srid -> Int4,
        auth_name -> Nullable<Varchar>,
        auth_srid -> Nullable<Int4>,
        srtext -> Nullable<Varchar>,
        proj4text -> Nullable<Varchar>,
    }
}

table! {
    users (id) {
        id -> Uuid,
        username -> Text,
        email -> Text,
        password -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

joinable!(datasets -> users (owner_id));

allow_tables_to_appear_in_same_query!(
    datasets,
    queries,
    spatial_ref_sys,
    users,
);
