import React,{useState,useEffect} from 'react'
import {Styles} from './DatasetViewDetailsStyles'
import {Tabs,Tab} from '../Tabs/Tabs'
import {QueryPane} from '../QueryPane/QueryPane'
import {Form} from '../Forms/Forms'
import {Button, ButtonType} from '../Button/Button'
interface DatasetViewDetailsProps{
    feature?: any;
    onUpdate?: (update:any)=>void
}

export const DataSetViewDetails : React.FC<DatasetViewDetailsProps>= ({feature, onUpdate, children})=>{
    const [editFeature,updateEditFeature] = useState<any>(null);
    const [dirty, setDirty] = useState(false)

    useEffect(()=>{
        setDirty(false)
        updateEditFeature({...feature})
    },[feature])

    const updateField = (variable:string)=>{
        return (e:any)=>{
            setDirty(true)
            const newVal = e.target.value
            updateEditFeature({
                ...editFeature,
                [variable]: newVal
            })
        }
    }

    const discard = ()=>{
        updateEditFeature({...feature})
        setDirty(false)
    }
    const save = ()=>{
        if(onUpdate){
            onUpdate(save)
        }
            setDirty(false)
    }
    return(
        <Styles.DatasetViewDetails>
            <Tabs>
                <Tab name='Query'>
                    {children}
                </Tab>
                <Tab name='Feature'>
                    <h2>Feature details</h2>
                    {feature ? 
                        <Form>
                            {Object.entries(editFeature).map(([name,value])=>
                                <Styles.FormEntry>
                                    <label>{name}</label>
                                    <input type='text' onChange={updateField(name)} value={value as any} />
                                </Styles.FormEntry>
                            )}
                        {dirty && 
                            <>
                                <Button onClick={save}>Save</Button>
                                <Button onClick={discard} kind={ButtonType.Secondary} type='submit' >Discard</Button>
                            </>
                        }
                        </Form>
                        :
                        <p>Click a feature to edit</p>
                   }
                </Tab>
            </Tabs>

        </Styles.DatasetViewDetails>
    )
}