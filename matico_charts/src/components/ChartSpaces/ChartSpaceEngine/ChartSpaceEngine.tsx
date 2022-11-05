import React from "react"
import {ContinuousChartSpace} from "../Continuous"
import { useStore } from "../../../Store/maticoChartStore"

const ChartSpaceMapping = {
    "continuous": ContinuousChartSpace,
    "categorical": React.Fragment,//CategoricalChartSpace,
    "cartographic": React.Fragment,//CartographicChartSpace,
}
export const ChartSpaceEngine: React.FC = () => {
    const type = useStore(state => state.type)
    const ChartSpace = ChartSpaceMapping[type]
    return <ChartSpace />
} 