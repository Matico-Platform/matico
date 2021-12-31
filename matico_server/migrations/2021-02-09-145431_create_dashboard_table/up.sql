CREATE TABLE dashboards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id uuid NOT NULL,
    description TEXT NOT NULL,
    map_style jsonb NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL,
    public BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_user
    FOREIGN KEY(owner_id)
    REFERENCES users(id)
);

CREATE INDEX dashboard_owner_index ON dashboards USING btree(owner_id);