# DistributionPlotComponent

This component plots one or multiple box and violin plots from statistical data. 

## Parameters

* `data`: Must be an array of `BoxPlotStats`, a type added to `types.ts`. (Note that `baseLayerSpec` was changed so that `data` could be this of this type, and that other plot specs were changed to specify that their `data` is of type `DataCollection`.) Each element in the array is plotted as its own boxplot and/or violin plot. The data consists of two parts:
    - `boxPlot`: The boxplot's name and stats, consisting of a min, max, median, 1st and 3rd quartiles, and an array of outliers. This is used to create the boxplot. This data *must* be provided even if you only want to render violin plots. **TO DO: Right now the boxplot name needs to be provided for the discrete axis to render. This should probably be fixed so we can make the boxplot optional**
    - `binData`: an array of pairs of numbers, consisting of a value and the frequency of that value. This is used to create the violin plot. This data is optional: if you only want to graph boxplots, you don't have to provide it.
* `showBoxPlot`: Renders boxplot data if `true`, does not if `false`. `true` by default.
* `showViolinPlot`: Renders violin plot data if `true`, does not if `false`. `true` by default.
* `boxPlotStroke`: The stroke color for the boxplot.
* `boxPlotFill`: The fill color for the boxplot.
* `boxPlotStroke`: The stroke color for the violin plot.
* `boxPlotFill`: The fill color for the violin plot.
* `horizontal`: Whether the plots are rendered vertically or horizontally. If set to `true`, the plots render horizontally and the y axis' `scaleType` must be set to `band`, while the x axis must have a continuous scale. If `false`, the plots render vertically and the x axis' `scaleType` must be set to `band`, while the y axis must have a continuous scale. `false` by default.
* `tooltip`: if `true`, renders a tooltip when the mouse hovers over the boxplot. `true` by default.