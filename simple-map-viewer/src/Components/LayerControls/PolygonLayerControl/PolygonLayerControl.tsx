import React from 'react';
import { Styles } from './PolygonLayerControlStyles';
import { SimpleSwitch } from 'Components/SimpleSwitch/SimpleSwitch';

import {
    PolygonStyle,
    LayerSource,
    Column,
    ColorSpecification,
    Unit,
    ValueSpecification,
} from 'api';

import {
    ColorSelector,
    ColorMappingTypes,
} from 'Components/ColorComponents/ColorSelector/ColorSelector';

import { NumericalSelector } from 'Components/NumericalComponents/NumericalSelector';

interface PolygonLayerControlProps {
    style: PolygonStyle;
    onChange: (update: PolygonStyle) => void;
    columns: Column[];
    source: LayerSource;
}

export const PolygonLayerControl: React.FC<PolygonLayerControlProps> = ({
    onChange,
    style,
    columns,
    source,
}) => {
    const updateFill = (spec: ColorSpecification) => {
        onChange({
            ...style,
            fill: spec,
        });
    };
    const updateStroke = (spec: ColorSpecification) => {
        onChange({
            ...style,
            stroke: spec,
        });
    };
    const updateStrokeWidth = (stroke: number) => {
        onChange({
            ...style,
            stroke_width: stroke,
        });
    };

    const updateStrokeUnits = (unit: Unit) => {
        onChange({
            ...style,
            stroke_units: unit,
        });
    };

    const updateElevation = (elevation: ValueSpecification) => {
        onChange({
            ...style,
            elevation: elevation,
        });
    };

    return (
        <>
            <ColorSelector
                name="Fill Color"
                colorSpecification={style.fill}
                onUpdate={updateFill}
                columns={columns}
                source={source}
                availableTypes={[
                    ColorMappingTypes.Simple,
                    ColorMappingTypes.Category,
                    ColorMappingTypes.Value,
                ]}
            />

            <ColorSelector
                columns={columns}
                source={source}
                name="Stroke Color"
                colorSpecification={style.stroke}
                onUpdate={updateStroke}
                availableTypes={[
                    ColorMappingTypes.Simple,
                    ColorMappingTypes.Category,
                    ColorMappingTypes.Value,
                ]}
            />

            <section>
                <label>Stroke Width</label>
                <input
                    value={style.stroke_width}
                    type="number"
                    onChange={(e) =>
                        updateStrokeWidth(parseFloat(e.target.value))
                    }
                />

                <SimpleSwitch
                    options={Object.keys(Unit)}
                    selected={style.stroke_units as string}
                    onChange={(unit: string) => updateStrokeUnits(unit as Unit)}
                />
            </section>

            <NumericalSelector
                name="Elevation"
                columns={columns}
                source={source}
                valueSpecification={style.elevation}
                onUpdate={(elevation: ValueSpecification) =>
                    updateElevation(elevation)
                }
            />
        </>
    );
};
