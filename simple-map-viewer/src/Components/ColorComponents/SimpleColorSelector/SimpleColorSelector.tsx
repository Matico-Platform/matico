import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { ColorBar } from 'Components/ColorComponents/ColorBar/ColorBar';
import { Styles } from './SimpleColorSelectorStyles';
import { SingleColorSpecification, DefaultFillColor } from 'api';

interface SimpleColorSelector {
    spec: SingleColorSpecification;
    onUpdate: (color: SingleColorSpecification) => void;
}

export const SimpleColorSelector: React.FC<SimpleColorSelector> = ({
    spec,
    onUpdate,
}) => {
    const [expand, setExpand] = useState<boolean>(false);

    const updateColor = (color: any) => {
        const rgb: number[] = Object.values(color.rgb);
        const spec: SingleColorSpecification = {
            color: [rgb[0], rgb[1], rgb[2], rgb[3] * 255],
        };
        onUpdate(spec);
    };

    useEffect(() => {
        if (!spec) {
            onUpdate({ color: DefaultFillColor });
        }
    }, [spec]);

    if (!spec) {
        return <p>Loading ...</p>;
    }
    const col = spec.color;
    return (
        <Styles.SimpleColorSelector>
            <ColorBar
                onClick={() => setExpand(!expand)}
                col={spec.color}
            />
            {expand && (
                <SketchPicker
                    onChange={updateColor}
                    color={{
                        r: col[0],
                        g: col[1],
                        b: col[2],
                        a: col[3],
                    }}
                />
            )}
        </Styles.SimpleColorSelector>
    );
};
