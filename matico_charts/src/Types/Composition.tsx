import { AnyD3Scale } from "@visx/scale"
import { scaleMap, colorSchemeMap } from "../Utils/ScaleParser"

// SPECIFICATION
export type Data = Array<Record<string, any>>

export type ChartComposition = {
    charts: Array<ChartLayout>
    data?: Data
}

export type ChartLayout = {
    spec: Chart
    position?: ({ left: number } | { right: number }) & ({ top: number } | { bottom: number })
    width?: number
    height?: number
    facet?: {
        x: string
        y: string
    }
}

export type Chart = {
    layers?: Array<Layer>
    labels?: Array<LabelSpec>
    data?: Data
}

export type Layer = {
    type: string
    data?: Data
    onClick?: (event: any) => void
    onHover?: (event: any) => void
}

export type ScaleSpec = {
    type: string
    column: string
    domain?: Array<number> | Array<string>
    range?: Array<number> | keyof typeof colorSchemeMap
    nice?: boolean
    zero?: boolean
    clamp?: boolean
}

export type LabelSpec = {
    text: string
    type: "title" | "subtitle" | "attribution" | "arbitrary"
    position?: "top" | "bottom" | "left" | "right"
    align?: "left" | "right" | "center"
    rotation: number
}

// STATE
export type ScaleHash = string
export type UpdateTrigger = number | Date | string
export type ScaleState = { scaleFunction: AnyD3Scale
    extent: Array<string> | Array<number> | Array<Date>
    dataId: string
    spec: ScaleSpec
    hash: ScaleHash
    shouldRecalculate: boolean
}

export type ChartCompositionState = {
    root: {
        width: number
        height: number
        data?: string
    },
    datasets: {
        [key: string]: UpdateTrigger
    },
    scales: {
        [key: ScaleHash]: ScaleState
    },
    charts: Array<ChartState>,
    link: {
        [key: ScaleHash]: {
            min: number
            max: number
        } | {
            active: Array<string>
        }
    },
    active: {
        [key: string]: Array<number>
    },
    initialized: boolean
}

export type ExternalDataStore = {
    [key: string]: Data
}

export type ScaleTypes = "x" | "y" | "color" | "size" | "shape" | "projection"
export type RequiredScales =  { [K in ScaleTypes]: ScaleHash | null }

export type ChartState = {
    parent: string
    id: string
    width: number
    height: number
    top: number
    left: number
    scales: RequiredScales
    layers: Array<LayerState>
    data?: string | null
}

export type LayerState = {
    parent: string
    id: string
    type: string
    scales: RequiredScales
    data?: string | null
}