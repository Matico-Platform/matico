import React, { useState } from 'react';
import { Column, PointStyle, Layer, LayerSource } from 'api';
import { ColorSpecification, Unit } from 'api';
import {
    ColorSelector,
    ColorMappingTypes,
} from 'Components/ColorComponents/ColorSelector/ColorSelector';
import { UnitSwitch } from 'Components/UnitSwitch/UnitSwitch';

interface PointLayerControlProps {
    style: PointStyle;
    onChange: (update: PointStyle) => void;
    columns: Column[];
    source: LayerSource;
}

export const PointLayerControl: React.FC<PointLayerControlProps> = ({
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

    const updateSize = (size: number) => {
        onChange({
            ...style,
            size,
        });
    };
    const updateSizeUnit = (unit: Unit) => {
        onChange({
            ...style,
            size_units: unit,
        });
    };

    const updateStrokeUnit = (unit: Unit) => {
        onChange({
            ...style,
            stroke_units: unit,
        });
    };

    const updateStrokeWidth = (number: number) => {
        onChange({
            ...style,
            stroke_width: number,
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
                ]}
            />

            <ColorSelector
                name="Stroke Color"
                colorSpecification={style.stroke}
                onUpdate={updateStroke}
                columns={columns}
                source={source}
                availableTypes={[
                    ColorMappingTypes.Simple,
                    ColorMappingTypes.Category,
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
                <UnitSwitch
                    selected={style.stroke_units}
                    onChange={(unit) => updateStrokeUnit(unit)}
                />
            </section>

            <section>
                <label>Size</label>
                <input
                    value={style.size}
                    type="number"
                    onChange={(e) =>
                        updateSize(parseFloat(e.target.value))
                    }
                />
                <UnitSwitch
                    selected={style.size_units}
                    onChange={(unit) => updateSizeUnit(unit)}
                />
            </section>
        </>
    );
};
