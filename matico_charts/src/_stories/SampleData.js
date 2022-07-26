import {
    generate2dData,
    getRegressionLine,
    getHistogramData,
    getCategoricalData,
    getMapData
} from './StoryUtils'

const SampleMapData = getMapData()
const Sample2dData = generate2dData(1000)
const SampleRegressionLineData = getRegressionLine(Sample2dData)
const SampleHistogramData = getHistogramData(Sample2dData)
const SampleCategoricalData = getCategoricalData(1000)
const SampleMapData= getMapData(1)
const SampleMapData2= getMapData(2)

export {
    SampleMapData,
    Sample2dData,
    SampleRegressionLineData,
    SampleHistogramData,
    SampleCategoricalData,
    SampleMapData,
    SampleMapData2
}
