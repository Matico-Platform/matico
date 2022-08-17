# DistributionPlotComponent

This component plots multiple box and violin plots from statistical data. 

## Parameters

* `data`: an array where entries have type `BoxPlotStats`. (Note that `baseLayerSpec` was changed so that `data` could be this of this type, and that other plot specs were changed to specify that their `data` is of type `DataCollection`.) 
Each entry in the array produces a box and/or violin plot according to its properties `boxPlot` and `binData`:
    - `boxPlot`: an object with properties `x` (name of treatment or case), `min`, `max`, `firstQuartile`, `thirdQuartile`, and `outliers` (an array). The component currently requires all entries of `data` to have the `boxPlot` property, even if the user only wants to render violin plots. **TO DO: Right now the boxplot name needs to be provided for the discrete axis to render. This should probably be fixed so we can make the boxplot optional.**
    - `binData`: an array of objects with properties `value` and `count` (the frequency of the value). Note that `binData` is optional and only required to create violin plots. 
* `showBoxPlot`: renders boxplot data if `true` (default), does not if `false`
* `showViolinPlot`: renders violin plot data if `true` (default) and not if `false`
* `boxPlotStroke`: sets the stroke color of the box plot, either a hex/color string or rgb/rgba array
* `boxPlotFill`: sets the fill color of the box plot, either a hex/color string or rgb/rgba array
* `violinPlotStroke`: sets the stroke color of the violin plot, either a hex/color string or rgb/rgba array
* `violinPlotFill`: sets the fill color of the violin plot, either a hex/color string or rgb/rgba array
* `horizontal`: determines whether horizontal or vertical box and violin plots are rendered. If `true`, then the plots render horizontally and the y axis' `scaleType` must be set to `band`, while the x axis must have a continuous scale. If `false`, then the plots render vertically and the x axis' `scaleType` must be set to `band`, while the y axis must have a continuous scale. Vertical plots are shown by default
* `tooltipOn`: renders a tooltip when the mouse hovers over various parts of the box plot if `true` (default)

## Example of  `data`

Here is an example of the type of data that the component will take in.
```
[
    {"boxPlot": {
        "x": "Group 1",
        "min": 0,
        "max": 10,
        "median": 5,
        "firstQuartile": 2.5,
        "thirdQuartile": 7.5,
        "outliers": [-100, 100]
    },
    "binData": [
        {value: 1, count: 0},
        {value: 9, count: 1},
    ]
    },
    {"boxPlot": {
        "x": "Group 2",
        "min": 0,
        "max": 1,
        "median": 0.5,
        "firstQuartile": 0.25,
        "thirdQuartile": 0.75,
        "outliers": []
    },
    "binData": []
    }
]
```
One of the examples in Storybook demonstrates pulling in data from a `.json` file on male and female income. 

## Notes on the tooltips

The tooltip functionality is provided by the `useTooltip` and `useTooltipInPortal` hooks in `@visx/tooltip`. Inside the component, states `tooltipShouldDetectBounds` and `renderTooltipInPortal` are declared and set to `true` and determine the `visx` component assigned to `TooltipComponent`. It is unclear how `renderTooltipInPortal` will affect the way tooltips are renderd in Matico. As of the current version, tooltips always remain within the bounds of the window and do not appear to be cut off near the borders (due to the `visx` components' border detection capabilities). 

There are some issues with tooltip positioning in Storybook if the plots could be scrolled. This issue is currently resolvable by showing the plots in a different window ("Go full screen" or "Open canvas in new tab").