ALTER TABLE datasets ADD COLUMN import_params JSONB NOT NULL DEFAULT '{"GeoJson":{}}';
