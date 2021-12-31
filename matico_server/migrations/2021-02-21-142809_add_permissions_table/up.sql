CREATE TABLE PERMISSIONS(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id  uuid NOT NULL,
    resource_id  uuid NOT NULL,
    permission  text NOT NULL,
    resource_type text NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
);

CREATE INDEX permissions_user_id_resource_id_permision_index on PERMISsIONS (user_id, resource_id, permission);