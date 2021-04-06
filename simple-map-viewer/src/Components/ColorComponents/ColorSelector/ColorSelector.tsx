import { Styles } from './ColorSelectorStyles';
import React, { useState } from 'react';
import { CategoryColorSelector } from 'Components/ColorComponents/CategoryColorSelector/CategoryColorSelector';
import { SimpleColorSelector } from 'Components/ColorComponents/SimpleColorSelector/SimpleColorSelector';
import {
    faPalette,
    faAlignJustify,
    faCalculator,
} from '@fortawesome/free-solid-svg-icons';
import { Column, LayerSource, ColorSpecification } from 'api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export enum ColorMappingTypes {
    Value = 'value',
    Category = 'category',
    Simple = 'manual',
}

const icons = {
    value: faCalculator,
    category: faAlignJustify,
    manual: faPalette,
};

interface ColorSelectorProps {
    onUpdate: (spec: ColorSpecification) => void;
    colorSpecification: ColorSpecification;
    name: string;
    availableTypes: ColorMappingTypes[];
    columns: Column[];
    source: LayerSource;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
    name,
    onUpdate,
    colorSpecification,
    availableTypes,
    columns,
    source,
}) => {
    const [activeMode, setActiveMode] = useState<ColorMappingTypes>(
        ColorMappingTypes.Simple,
    );

    return (
        <section>
            <Styles.Header>
                <label>{name}</label>
                <Styles.Modes>
                    {availableTypes.map((mode) => (
                        <FontAwesomeIcon
                            className="icon"
                            style={{
                                cursor: 'pointer',
                                color:
                                    mode === activeMode
                                        ? 'white'
                                        : 'grey',
                            }}
                            icon={icons[mode]}
                            onClick={() => setActiveMode(mode)}
                        />
                    ))}
                </Styles.Modes>
            </Styles.Header>
            <Styles.Selector>
                {activeMode === ColorMappingTypes.Simple && (
                    <SimpleColorSelector
                        spec={colorSpecification.single_color!}
                        onUpdate={(spec) =>
                            onUpdate({ single_color: spec })
                        }
                    />
                )}
                {activeMode === ColorMappingTypes.Category && (
                    <CategoryColorSelector
                        spec={colorSpecification.category_color!}
                        onUpdate={(spec) =>
                            onUpdate({ category_color: spec })
                        }
                        columns={columns}
                        source={source}
                    />
                )}
            </Styles.Selector>
        </section>
    );
};
