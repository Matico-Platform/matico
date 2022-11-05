import { AccessorFunction } from "../../types"

export interface DotSpec {
    xScale: (d: number) => number
    yScale: (d: number) => number
    xAccessor: AccessorFunction
    yAccessor: AccessorFunction
    index: number
}
