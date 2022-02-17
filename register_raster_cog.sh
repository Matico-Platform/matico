raster2pgsql \     
  -s 3857\        # SRID of the data
  -t 256x256 \       # Tile raster
  -I \               # Index the table
  -R \               # Load as "out-db", metadata only
  /vsicurl/https://allofthedata.s3.us-west-2.amazonaws.com/lightpolution/cog.tif \
  lightpolution \            # Table name to use
  | psql -d sms_data
