import { AnyD3Scale } from "@visx/scale"
import { AccessorFunction } from "../../types"

export interface DotSpec {
    xScale: AnyD3Scale
    yScale: AnyD3Scale
    xAccessor: AccessorFunction
    yAccessor: AccessorFunction
    index: number
}
