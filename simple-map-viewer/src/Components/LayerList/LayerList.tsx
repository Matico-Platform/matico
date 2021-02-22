import React from 'react';
import { Styles } from './LayerListStyles';
import { LayerControlls } from '../LayerControlls/LayerControlls';
import { useDashboard } from '../../Contexts/DashbardBuilderContext';

export const LayerList: React.FC = () => {
    const { dashboard } = useDashboard();
    const layers = dashboard ? dashboard.map_style.layers : [];

    return (
        <Styles.LayerList>
            {layers.map((layer) => (
                <>
                    <LayerControlls key={layer.name} layer={layer} />
                </>
            ))}
        </Styles.LayerList>
    );
};
