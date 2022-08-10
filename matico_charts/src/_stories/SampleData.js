import {
    generate2dData,
    getRegressionLine,
    getHistogramData,
    getCategoricalData,
    getDistributionData,
} from './StoryUtils'

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
    SampleDistData2
}