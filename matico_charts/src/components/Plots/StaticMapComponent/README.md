# StaticMapComponent

This component plots a GeoJSON object with a given projection and graticule. It uses visx and d3-geo functions to do so. It can handle the six main types of GeoJSON geometries. The different features in the object can all be filled with the same color, or filled using a function based on their properties. The object is translated and scaled to fit the window using d3's `projection.fitExtent()` function. For larger objects, the graticule's extent is calculated via d3's `projection.clipExtent()` function, but for smaller objects it is calculated by preclipping based on the latitude and longitude coordinates of the window's corners and centers of its edges. The step size of the graticule is computed automatically, and is always 10*2^(-n) degrees, where n is a non-negative integer. 


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
* `events`: turns pop-ups on (`true` by default) or off (`false`)