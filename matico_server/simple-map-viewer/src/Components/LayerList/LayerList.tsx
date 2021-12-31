import React from 'react';
import { Styles } from './LayerListStyles';
import { LayerControls } from '../LayerControls/LayerControls';
import {Layer} from 'types'
import { useDashboard } from '../../Contexts/DashbardBuilderContext';

export const LayerList: React.FC = () => {
    const { dashboard } = useDashboard();
    const layers = dashboard ? dashboard.map_style.layers : [];

    return (
        <Styles.LayerList>
            {layers.map((layer :Layer) => (
                <LayerControls key={layer.name} layer={layer} />
            ))}
        </Styles.LayerList>
    );
};
