SELECT ST_AsMVT(q, 'layer', 4096, 'mvt_geom') as mvt 
    FROM (
      SELECT
          {columns},
        --   ogc_fid::INTEGER as id,
          ST_AsMVTGeom(
              ST_TRANSFORM(geom, 3857),
              ST_TileEnvelope({z},{x},{y})
          ) mvt_geom
      FROM (
        select *, {geom_column} as geom from ({tile_table}) b
        where {geom_column} && ST_TRANSFORM(ST_TileEnvelope({z},{x},{y}), 4326)
      ) c
    ) q
    limit 1 
    ;
