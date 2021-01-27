import React from 'react'
import {useDatasets} from '../../Hooks/useDatasets'
import {Styles} from './DatasetListStyles'
import {Card} from '../Card/Card'
import {Link} from 'react-router-dom'

interface DatasetListProps{

}

export const DatasetList: React.FC<DatasetListProps> = ({})=>{
    const {datasets, loading} = useDatasets();

    return(
        <Styles.DatasetListOuter>
            <h2>Datasets</h2>
            {loading ? 
            <h3>Loading...</h3>
            :
            <Styles.DatasetList>
                {datasets.map(dataset=>(
                    <Card key={dataset.id}>
                        <h3>{dataset.name}</h3>
                        <p>{dataset.description}</p>
                        <Link to={`/datasets/${dataset.id}`}>view</Link>
                    </Card>
                ))}

            </Styles.DatasetList>
            }
        </Styles.DatasetListOuter>
    )
}