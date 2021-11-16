import React from 'react'
import {Box,RangeSelector} from 'grommet'
import {useAutoVariable} from '../../../Hooks/useAutoVariable'

interface MaticoRangeControlInterface{
    min:number;
    max:number;
    step: number;
    name: string
}

export const MaticoRangeControl : React.FC<MaticoRangeControlInterface> = ({min,max,step,name})=>{

  const [value, updateValue] = useAutoVariable({name:`range_control_${name}`, type:'any', initialValue:[min,max], bind:true})
  return (
    <Box flex={'grow'}>
      <RangeSelector values={value} min={min} max={max} step={step} onChange={(val)=> updateValue(val)}/>
    </Box>
  )
}
