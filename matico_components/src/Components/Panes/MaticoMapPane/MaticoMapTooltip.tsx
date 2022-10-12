import React, { useMemo } from 'react';
import {format} from 'd3-format';
import centroid from '@turf/centroid';
import { Marker } from "react-map-gl";
import { Flex, ProgressCircle, Text, View } from "@adobe/react-spectrum";
import Pin from "@spectrum-icons/workflow/PinOff";
import Target from "@spectrum-icons/workflow/Target";
import { useGetFeatures } from 'Hooks/useGetFeatures'
import {convertPoly} from './LayerUtils'
import wkx from "wkx";

export interface TooltipColumnSpec {
    column: string;
    label?: string;
    formatter?: string;
}

export interface TooltipSpec {
    datasetName: string;
    id: number | undefined;
    columns: TooltipColumnSpec[];
    pinned?: boolean;
}

export const MaticoMapTooltip: React.FC<TooltipSpec> = ({
    datasetName,
    id,
    columns,
    pinned
}) => {

    const featureResult = useGetFeatures({
        datasetName,
        ids: id ? [id] : []
    })
    const state = featureResult?.state
    const result = featureResult?.result?.[0]

    const {
        geometry: {
            coordinates: [longitude, latitude]
        }
    } = useMemo(() => {
        if (state === "Done" && result?.geom){
            try {
                const coords = convertPoly(wkx.Geometry.parse(Buffer.from(result?.geom)));
                return centroid({
                    type: "Feature",
                    geometry: {
                        type: 'Polygon',
                        //@ts-ignore
                        coordinates: coords
                    }
                })
            } catch {
                return {geometry:{coordinates:[0,0]}}
            }
        } else {
            //@ts-ignore
            return {geometry:{coordinates:[0,0]}}
        }
    },[JSON.stringify(result?.geom)])

    const data = columns.map(({label, column, formatter}) => {
        const text = label || column
        const rawValue = result?.[column]
        console.log('column', rawValue, result)
        if (!rawValue) return {text, value: "N/A"}
        let formattedValue = rawValue
        try {
            formattedValue = formatter 
                ? format(formatter)(rawValue)
                : rawValue
        } catch {
        }
        return {label: [text], value: formattedValue}
    })
    // ,[JSON.stringify({columns, result})])

    if (id === undefined || datasetName === undefined || !columns.length) return null
    console.log(data)
    return <TooltipInner
        {
            ...{
                latitude,
                longitude,
                pinned,
                data
            }
        }
        />

}

interface TooltipInnerSpec {
    data: {[key: string]: any};
    latitude: number;
    longitude: number;
    pinned?: boolean
}

const TooltipInner: React.FC<TooltipInnerSpec> = ({
    data,
    latitude,
    longitude,
    pinned
    }) => {
        console.log(data)

    return <><Marker
        latitude={latitude}
        longitude={longitude}
        anchor="bottom"
        style={{ pointerEvents: "none" }}
        offset={[0, -20]}
    >
        <View
            backgroundColor="gray-200"
            padding="size-50"
            UNSAFE_style={{
                textAlign: "left",
                lineHeight: 1.2,
                boxShadow: "0 0 4px rgba(0,0,0,0.5)"
            }}
        >
            {data ? (
                <Flex direction="column">
                    {data.map(
                        (entry:any, i:number) =>
                            (
                                <Text key={`${entry.label}-${i}`}>
                                    <b>{entry.label}:</b> {entry.value}
                                </Text>
                            )
                    )}
                </Flex>
            ) : (
                <ProgressCircle aria-label="Loading…" isIndeterminate />
            )}
        </View>
    </Marker>
    <Marker
        latitude={latitude}
        longitude={longitude}
        anchor="center"
        style={{ pointerEvents: "none" }}
    >
        {pinned ? (
            <Pin color="informative" size="S" />
        ) : (
            <Target color="informative" size="S" />
        )}
    </Marker>
    </>

}