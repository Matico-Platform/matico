import React, { useCallback } from 'react'
import {useDashboard} from '../../Contexts/DashbardBuilderContext'
import {FlexSeperator} from '../Layout/Layout'
import {BaseMapSelector} from '../BaseMapSelector/BaseMapSelector'
import {BaseMap} from '../../api'
import {LayerList} from '../LayerList/LayerList'
import {Styles} from './DashboardBuilderControllsStyles'
import {Button,ButtonType} from '../Button/Button'
import {AddLayerModal} from '../../Components/AddLayerModal/AddLayerModal'

interface DashboardBuilderControllerProps{}

export const DashboardBuilderControlls: React.FC<DashboardBuilderControllerProps> =({})=>{
    const {
        loading, 
        dashboard, 
        saving,
        errors, 
        showNewLayerModal,
        hideNewLayerModal,
        newLayerModalVisible,
        updateBaseMap, 
        addLayer
    } = useDashboard();
    const mapStyle = dashboard?.map_style;

    const changeBaseMap = (baseMap:BaseMap)=>{
        updateBaseMap(baseMap)
    }
    
    return(
        <>
            { loading  ? 
                <h1>Loading...</h1>
                :
                <>
                    <h1>{dashboard?.name}</h1>
                    <p>{dashboard?.description}</p>

                    {mapStyle && 
                    <Styles.Sections>
                    <Styles.Section>
                        <h2>BaseMap</h2>
                        <BaseMapSelector baseMap={mapStyle.base_map}  onChange={changeBaseMap} />
                    </Styles.Section>
                    <Styles.Section>
                        <h2>Layers</h2>
                        <LayerList />
                        <Button onClick={showNewLayerModal} kind={ButtonType.Primary}>
                            Add layer
                        </Button>
                    </Styles.Section>
                        </Styles.Sections>
                    }
                </>
            }
            <FlexSeperator/>
            {errors &&
                <p>{errors.join(",")}</p>
            }
            {saving && 
                <p>Saving...</p>
            }

            {newLayerModalVisible && 
                <AddLayerModal onDone={addLayer} onDismiss={hideNewLayerModal}/>
            }

        </>
    )
}