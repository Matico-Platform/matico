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
const SampleMapData= getMapData(1)
const SampleMapData2= getMapData(2)
const SampleMapData3= getMapData(3)
const SampleMapData4= getMapData(4)
const SampleMapData5= getMapData(5)
const SampleMapData6= getMapData(6)

export {
    Sample2dData,
    SampleRegressionLineData,
    SampleHistogramData,
    SampleCategoricalData,
    SampleMapData,
    SampleMapData2,
    SampleMapData3,
    SampleMapData4,
    SampleMapData5,
    SampleMapData6
}
