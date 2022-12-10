import React from "react"
import { useEffect } from "react"
import { useStore } from "../Stores/Store"
import { ChartComposition } from "../Types/Composition"
import { ParentSize } from "@visx/responsive";

export type MaticoChartProps = {
    spec: ChartComposition
    width?: number
    height?: number
}

export default function Wrapper({
    spec,
    width,
    height
}: MaticoChartProps) {

    return <div style={{ background: "orange", width: width || "100%", height: height || "auto" }}>
        <ParentSize>
            {({ width, height }) => (
                <Inner spec={spec} width={width} height={height} />
            )}
        </ParentSize>
    </div>
}


function Inner({ spec, width, height }: MaticoChartProps) {

    const {upsertSpec, setDimensions} = useStore(state => ({upsertSpec:state.upsertSpec, setDimensions: state.setDimensions}))

    useEffect(() => {
        upsertSpec(spec)
    }, [spec])

    useEffect(() => {
        setDimensions(width!, height!)
    }, [width, height])

    return <svg>
        <text>asdf</text>
    </svg>

}