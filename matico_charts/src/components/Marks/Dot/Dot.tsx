import React from "react"
import { useStore } from "../../../Store/maticoChartStore"
import { DotSpec } from "./types"

export const Dot: React.FC<DotSpec> = ({
    xScale,
    xAccessor,
    yScale,
    yAccessor,
    index,
}) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const d = useStore((state) => state.data[index])

    return <circle
        cx={xScale(xAccessor(d))}
        cy={yScale(yAccessor(d))}
        r={isHovered ? 10 : 3}
        fill="red"
        style={{
            transition: "all .1s ease-in-out",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    />
}