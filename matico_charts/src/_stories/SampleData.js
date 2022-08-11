import {
    generate2dData,
    getRegressionLine,
    getHistogramData,
    getCategoricalData,
    getDistributionData,
} from './StoryUtils'
import { computeStats } from '@visx/stats'

const Sample2dData = generate2dData(1000)
const SampleRegressionLineData = getRegressionLine(Sample2dData)
const SampleHistogramData = getHistogramData(Sample2dData)
const SampleCategoricalData = getCategoricalData(1000)
const SampleDistData = getDistributionData(5)
const SampleDistData2 = getDistributionData(2)
console.log(SampleHistogramData)
export {
    Sample2dData,
    SampleRegressionLineData,
    SampleHistogramData,
    SampleCategoricalData,
    SampleDistData,
    SampleDistData2,
    SampleDistData3,
    SampleDistData4,
}

// Example of formatting of visx's Stats data type
// Data here is hard-coded from statistics produced in R for iris data
const SampleDistData3 = [
    {boxPlot: {
        x: "Sepal Length",
        min: 4.300,
        max: 7.900,
        median: 5.800,
        firstQuartile: 5.100,
        thirdQuartile: 6.400,
        outliers: []
    },
    binData: [
        {value: 4.25, count: 5},
        {value: 4.75, count: 27},
        {value: 5.25, count: 27},
        {value: 5.75, count: 30},
        {value: 6.25, count: 31},
        {value: 6.75, count: 18},
        {value: 7.25, count: 6},
        {value: 7.75, count: 6},
    ]},
    {boxPlot: {
        x: "Sepal Width",
        min: 2.0,
        max: 4.4,
        median: 3.0,
        firstQuartile: 2.8,
        thirdQuartile: 3.3,
        outliers: []
    },
    binData: [
        {value: 2.1, count: 4},
        {value: 2.3, count: 7},
        {value: 2.5, count: 13},
        {value: 2.7, count: 23},
        {value: 2.9, count: 36},
        {value: 3.1, count: 24},
        {value: 3.3, count: 18},
        {value: 3.5, count: 10},
        {value: 3.7, count: 9},
        {value: 3.9, count: 3},
        {value: 4.1, count: 2},
        {value: 4.3, count: 1}
    ]}
]

// Generating a dataset with extreme outliers
// computeStats doesn't produce something of type Stats
// The boxPlot property here has a different type (also called BoxPlot
// but is missing the x property)
const SampleDistData4 = computeStats([
    -100000,-12342,-50,-11,-10,-9.9,-3.2,-3.1,-3.1,-2.6,-2.5,-1.1,0,
    1,1,1,1,1.1,1.5,1.6,2.999,10000,50000, 9023134
])

SampleDistData4.boxPlot.x = "Sample Data"
