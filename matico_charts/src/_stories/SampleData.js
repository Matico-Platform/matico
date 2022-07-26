import {
    generate2dData,
    getRegressionLine,
    getHistogramData,
    getCategoricalData,
    getMapData
} from './StoryUtils'

const Sample2dData = generate2dData(1000)
const SampleRegressionLineData = getRegressionLine(Sample2dData)
const SampleHistogramData = getHistogramData(Sample2dData)
const SampleCategoricalData = getCategoricalData(1000)
const SampleMapData= getMapData()

export {
    Sample2dData,
    SampleRegressionLineData,
    SampleHistogramData,
    SampleCategoricalData,
    SampleMapData
}
