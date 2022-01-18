CREATE TYPE sync_import_status AS ENUM('pending','complete','error','in_progress');

CREATE TABLE sync_imports(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduled_for TIMESTAMP NOT NULL,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    status sync_import_status NOT NULL, 
    error  TEXT,
    dataset_id uuid NOT NULL,
    user_id uuid NOT NULL
);
