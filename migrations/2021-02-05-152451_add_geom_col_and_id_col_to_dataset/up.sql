ALTER TABLE datasets ADD geom_col TEXT NOT NULL DEFAULT 'wkb_geometry';
ALTER TABLE datasets ADD id_col TEXT NOT NULL DEFAULT 'id';