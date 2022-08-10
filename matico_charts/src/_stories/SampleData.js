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
const SampleDistData3 = computeStats([-100, -50, -2,-2,-1,0,1,2,2,3,3,3,1000,10000,123456])
console.log(SampleHistogramData)
export {
    Sample2dData,
    SampleRegressionLineData,
    SampleHistogramData,
    SampleCategoricalData,
    SampleDistData,
    SampleDistData2,
    SampleDistData3,
}

// Making data using computeStats from visx
