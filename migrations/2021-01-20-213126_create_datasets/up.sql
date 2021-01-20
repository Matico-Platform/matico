CREATE TABLE datasets(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id uuid NOT NULL,
    name  TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    original_type TEXT NOT NULL,
    sync_dataset BOOLEAN NOT NULL DEFAULT false,
    sync_url TEXT NOT NULL,
    sync_frequency_seconds  BIGINT DEFAULT 0,    
    post_import_script TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY(owner_id)
    REFERENCES users(id)
);

CREATE INDEX dataset_owner_index ON datasets USING btree(owner_id);