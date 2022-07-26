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
<<<<<<< HEAD
const SampleMapData= getMapData(1)
const SampleMapData2= getMapData(2)
=======
const SampleMapData = getMapData()
>>>>>>> 2747b0a5 (Ready to receive Chen's push)

export {
    Sample2dData,
    SampleRegressionLineData,
    SampleHistogramData,
    SampleCategoricalData,
    SampleMapData,
    SampleMapData2
}
