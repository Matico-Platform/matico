
// function ParseChart(chartSpec: ChartLayout, chartId?: string): Partial<ChartState> {
//     const {
//         width,
//         height,
//         position,
//         spec,
//         facet
//     } = chartSpec;

//     const id = chartId ? chartId : uid(7)

//     if (facet) {


//         return {}
//     } else {

//         const top = position ?
//             "top" in position
//                 ? position.top
//                 : 100 - position.bottom
//             : 0

//         const left = position ?
//             "left" in position
//                 ? position.left
//                 : 100 - position.right
//             : 0

//         // const layers = parseLayers(spec.layers, facet, id)

//         const chartState = {
//             parent: "root",
//             id,
//             width,
//             height,
//             top,
//             left
//         }
//         return chartState
//     }

//     return {}
// }

// // function parseLayers(layers: Array<Chart>, facet:, parentId: string): Array<LayerState> {
// //     return layers.map(layer => {
// //         const { id } = layer;
// //         return {
// //             parent: parentId,
// //             id,
// //             scales: {

// //             }
// //         }
// //     })
// // }
