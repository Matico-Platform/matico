import React, { useState } from 'react';
import {
    Layer,
    PolygonStyle,
    PointStyle,
    LayerStyle,
    LineStyle,
    LayerSource,
} from 'api';
import { Styles } from './LayerControlsStyles';
import { useDashboard } from 'Contexts/DashbardBuilderContext';
import { useSourceColumns } from 'Hooks/useSourceColumns';
import { PolygonLayerControl } from 'Components/LayerControls/PolygonLayerControl/PolygonLayerControl';
import { LineLayerControl } from 'Components/LayerControls/LineLayerControl/LineLayerControl';
import { PointLayerControl } from 'Components/LayerControls/PointLayerControl/PointLayerControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronRight,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

interface LayerControlProps {
    layer: Layer;
}
export const LayerControls: React.FC<LayerControlProps> = ({
    layer,
}) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const sourceType = Object.keys(layer.source)[0];
    const styleType = Object.keys(layer.style)[0];

    const columns = useSourceColumns(layer.source);

    const { updateLayerStyle } = useDashboard();

    const updateStyle = (update: LayerStyle) => {
        console.log('Update style is ', update);
        updateLayerStyle(layer.name, update);
    };

    return (
        <Styles.LayerControls>
            <h3 onClick={() => setCollapsed(!collapsed)}>
                <FontAwesomeIcon
                    icon={collapsed ? faChevronDown : faChevronRight}
                />{' '}
                {layer.name}
            </h3>
            <div style={{ display: collapsed ? 'block' : 'none' }}>
                {styleType == 'Polygon' && (
                    <PolygonLayerControl
                        onChange={(style) =>
                            updateStyle({ Polygon: style })
                        }
                        columns={columns ? columns : []}
                        source={layer.source}
                        style={layer.style.Polygon!}
                    />
                )}
                {styleType == 'Line' && (
                    <LineLayerControl
                        onChange={(style) =>
                            updateStyle({ Line: style })
                        }
                        columns={columns ? columns : []}
                        source={layer.source}
                        style={layer.style.Line!}
                    />
                )}
                {styleType == 'Point' && (
                    <PointLayerControl
                        onChange={(style) =>
                            updateStyle({ Point: style })
                        }
                        columns={columns ? columns : []}
                        source={layer.source}
                        style={layer.style.Point!}
                    />
                )}
            </div>
        </Styles.LayerControls>
    );
};
