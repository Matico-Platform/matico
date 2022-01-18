table! {
    use diesel::sql_types::*;

    apps (id) {
        id -> Uuid,
        name -> Text,
        owner_id -> Uuid,
        description -> Text,
        spec -> Jsonb,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        public -> Bool,
    }
}

table! {
    use diesel::sql_types::*;

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
        table_name -> Text,
    }
}

table! {
    use diesel::sql_types::*;

    permissions (id) {
        id -> Uuid,
        user_id -> Uuid,
        resource_id -> Uuid,
        permission -> Text,
        resource_type -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

table! {
    use diesel::sql_types::*;

    queries (id) {
        id -> Uuid,
        name -> Text,
        description -> Text,
        sql -> Text,
        parameters -> Array<Jsonb>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

table! {
    use diesel::sql_types::*;

    spatial_ref_sys (srid) {
        srid -> Int4,
        auth_name -> Nullable<Varchar>,
        auth_srid -> Nullable<Int4>,
        srtext -> Nullable<Varchar>,
        proj4text -> Nullable<Varchar>,
    }
}

table! {
    use diesel::sql_types::*;

    sync_imports (id) {
        id -> Uuid,
        scheduled_for -> Timestamp,
        started_at -> Nullable<Timestamp>,
        finished_at -> Nullable<Timestamp>,
        status -> crate::models::sync_import::SyncImportStatusMapping,
        error -> Nullable<Text>,
        dataset_id -> Uuid,
        user_id -> Uuid,
    }
}

table! {
    use diesel::sql_types::*;

    users (id) {
        id -> Uuid,
        username -> Text,
        email -> Text,
        password -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

allow_tables_to_appear_in_same_query!(
    apps,
    datasets,
    permissions,
    queries,
    spatial_ref_sys,
    sync_imports,
    users,
);
