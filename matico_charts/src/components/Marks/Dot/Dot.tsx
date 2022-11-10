import { Circle } from "@visx/shape"
import React from "react"
import { DotSpec } from "./types"

export const Dot: React.FC<DotSpec> = ({
    x,
    y,
    color,
    radius,
    data,
    index
}) => {
    const [isHovered, setIsHovered] = React.useState(false)
    return <Circle
        cx={x}
        cy={y}
        r={isHovered ? radius*2 : radius}
        fill={color}
        style={{
            transition: "r .1s ease-in-out",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    />
}