-- This file should undo anything in `up.sql`
ALTER TABLE datasets DELETE COLUMN table_name;
