import {
    schemeAccent,
    schemeBlues,
    schemeBrBG,
    schemeBuGn,
    schemeBuPu,
    schemeCategory10,
    schemeDark2,
    schemeGnBu,
    schemeGreens,
    schemeGreys,
    schemeOrRd,
    schemeOranges,
    schemePRGn,
    schemePaired,
    schemePastel1,
    schemePastel2,
    schemePiYG,
    schemePuBu,
    schemePuBuGn,
    schemePuOr,
    schemePuRd,
    schemePurples,
    schemeRdBu,
    schemeRdGy,
    schemeRdPu,
    schemeRdYlBu,
    schemeRdYlGn,
    schemeReds,
    schemeSet1,
    schemeSet2,
    schemeSet3,
    schemeSpectral,
    schemeTableau10,
    schemeYlGn,
    schemeYlGnBu,
    schemeYlOrBr,
    schemeYlOrRd
    // @ts-ignore
} from "d3-scale-chromatic"
import { externalDataStore } from "../Stores/Store";
import { Data, ScaleSpec, ScaleState } from "../Types/Composition";

import { scaleLinear, ScaleType } from "@visx/scale";
export const colorSchemeMap = {
    schemeAccent,
    schemeBlues,
    schemeBrBG,
    schemeBuGn,
    schemeBuPu,
    schemeCategory10,
    schemeDark2,
    schemeGnBu,
    schemeGreens,
    schemeGreys,
    schemeOrRd,
    schemeOranges,
    schemePRGn,
    schemePaired,
    schemePastel1,
    schemePastel2,
    schemePiYG,
    schemePuBu,
    schemePuBuGn,
    schemePuOr,
    schemePuRd,
    schemePurples,
    schemeRdBu,
    schemeRdGy,
    schemeRdPu,
    schemeRdYlBu,
    schemeRdYlGn,
    schemeReds,
    schemeSet1,
    schemeSet2,
    schemeSet3,
    schemeSpectral,
    schemeTableau10,
    schemeYlGn,
    schemeYlGnBu,
    schemeYlOrBr,
    schemeYlOrRd
} as const;
type colorSchemeName = keyof typeof colorSchemeMap

/** Scales that take time as domains */
export declare type TimeScaleType = 'time' | 'utc';
/** Scales that take continuous domains and return continuous ranges */
export declare type ContinuousScaleType = 'linear' | 'log' | 'pow' | 'sqrt' | 'symlog' | 'radial' | TimeScaleType;
/** Scales that convert continuous domains to discrete ranges */
export declare type DiscretizingScaleType = 'quantile' | 'quantize' | 'threshold';
/** Scales that take discrete domains and return discrete ranges */
export declare type DiscreteScaleType = 'ordinal' | 'point' | 'band';

export function ScaleParser({
    spec,
    dataId,
    autoRange
}: {
    spec: ScaleSpec,
    dataId: string,
    autoRange: Array<number> | keyof typeof colorSchemeMap
}): ScaleState {
    const data = externalDataStore[dataId]
    const { type, domain, column, nice, clamp, zero } = spec;
    const getter = (d: typeof data[number]) => d[column]
    const ScaleHash = HashScale(spec, dataId)
    const scaleState: Partial<ScaleState> = {
        spec,
        hash: ScaleHash,
        dataId,
        shouldRecalculate: false
    } 
    const range = spec?.range ? colorSchemeMap.hasOwnProperty(spec.range as colorSchemeName) ? colorSchemeMap[spec.range as colorSchemeName] : spec.range : autoRange
    switch (spec.type) {
        case "linear": {
            scaleState.extent = spec.domain ? spec.domain : getRange(data, getter)
            scaleState.scaleFunction = scaleLinear({
                domain: scaleState.extent,
                range,
                nice,
                clamp,
                zero
            })
        }
    }

}

export function HashScale(spec: ScaleSpec, dataId: string) {
    return `${JSON.stringify(spec)}-${dataId}`
}

function getRange(data: Data, getter: (d: any) => any) {
    let min = Infinity
    let max = -Infinity
    for (const d of data) {
        const val = getter(d)
        min = min < val ? min : val
        max = max > val ? max : val
    }
    return [min, max] as [number, number]
}

// function min<T>(data: T extends Data, getter: (d: any) => any) {
//     let min = Infinity
//     for (const d of data) min = Math.min(min, getter(d))
//     return min
// }

// function max<T>(data: T extends Data, getter: (d: any) => any) {
//     let max = -Infinity
//     for (const d of data) max = Math.max(max, getter(d))
//     return max
// }

function unique<T>(data: T extends Data, getter: (d: any) => any) {
    const Unique = new Set()
    for (const d of data) Unique.add(getter(d))
    // @ts-ignore
    return [...Unique]
}
