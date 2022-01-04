SELECT ST_AsMVT(q, 'layer', 4096, 'mvt_geom') as mvt 
    FROM (
      SELECT
          {columns},
        --   ogc_fid::INTEGER as id,
          ST_AsMVTGeom(
              geom,
              ST_TRANSFORM(ST_MakeEnvelope({x_min}, {y_min}, {x_max}, {y_max}, 3857), 4326),
              4096,
              256,
              true
          ) mvt_geom
      FROM (
        select *, {geom_column} as geom from ({tile_table}) b
        where {geom_column} && ST_TRANSFORM(ST_MakeEnvelope({x_min}, {y_min}, {x_max}, {y_max}, 3857), 4326)
      ) c
    ) q
    limit 1 
    ;