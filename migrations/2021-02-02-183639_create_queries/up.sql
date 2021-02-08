CREATE TABLE queries(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    sql TEXT NOT NULL,
    parameters JSONB[] NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX parameters_index ON queries USING GIN(parameters);