# StaticMapComponent

This component plots a GeoJSON object for a given projection using `visx` and `d3-geo` functions. It can handle the six main types of GeoJSON geometries (Point, MultiPoint, LineString, MultiString, Polygon, MultiPolygon). Different features in the object can be filled with the same color or according to a function based on each feature's `properties`.
The object is translated and scaled to fit the window using d3's `projection.fitExtent()` function. 
For large objects, the graticules' extent is calculated using d3's `projection.clipExtent`. 
For small objects, it is calculated by preclipping based on the latitude/longitude coordinates of the window's corners and edge centers.
The graticule step size is set to $10\times 2^{-n}$ degrees for some optimal nonnegative integer $n$.


## Parameters

The component consists of nine parameters.

* `data`: must be a valid `DataCollection` produced from a `geojson` file
* `proj`: sets the projection for the map, must be a string corresponding to one of the following projections;
    - `geoMercator` (default projection)
    - `geoConicConformal`
    - `geoTransverseMercator`
    - `geoNaturalEarth1`
    - `geoConicEquidistant`
    - `geoOrthographic`
    - `geoStereographic`
    - `geoEquirectangular`
* `fill`: determines the fill color for points and polygons, either a hex/color string, rgb/rgba array, or a custom function
<!-- * `background`: sets the background of the pane, either a hex/color string or rgb/rgba array -->
* `gratOn`: turns the graticules on (`true` by default) or off (`false`)
* `gratColor`: determines color of the graticules, either a hex/color string or rgb/rgba array
* `strokeWidth`: sets the stroke width for lines, polygon boundaries, and outline for points
* `strokeColor`: sets the stroke color for lines, polygon boundaries, and outline for points, either a hex/color string or rgb/rgba array
* `events`: turns pop-ups on (`true` by default) or off (`false`)