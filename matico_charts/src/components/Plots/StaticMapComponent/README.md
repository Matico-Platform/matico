# StaticMapComponent



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
* `background`: sets the background of the pane, either a hex/color string or rgb/rgba array
* `gratOn`: turns the graticules on (`true` by default) or off (`false`)
* `gratColor`: determines color of the graticules, either a hex/color string or rgb/rgba array
* `strokeWidth`: sets the stroke width for lines, polygon boundaries, and outline for points
* `strokeColor`: sets the stroke color for lines, polygon boundaries, and outline for points, either a hex/color string or rgb/rgba array
* `events`: turns pop-ups on (`true` by defaul) or off (`false`)