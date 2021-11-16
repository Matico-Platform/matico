
import React from 'react'
import {Box,Select} from 'grommet'
import {useAutoVariable} from '../../../Hooks/useAutoVariable'

interface MaticoSelectControlInterface{
  options: Array<string|number>;
  name:string;
  default_value: string
}

export const MaticoSelectControl : React.FC<MaticoSelectControlInterface> = ({options, name, default_value})=>{
  const [value, updateValue] = useAutoVariable({name:`select_control_${name}`, type:'any', initialValue:default_value, bind:true})
  return (
    <Box>
      <Select value={value} options={options} onChange={({option})=> updateValue(option)} />
    </Box>
  )

}
