trait DataSource{
    fn run_query()->ResultSet;
    fn run_tile_query -> MVTTile;
    fn run_metadata_query -> DatasetMeta;
}
