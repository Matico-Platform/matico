import React from 'react'
import {Dashboard} from 'matico_spec'

interface MaticoAppInterface{
  spec: Dashboard
}

export const MaticoApp : React.FC<MaticoAppInterface>= ()=>{
  return (<div>
    Matico App
  </div>)
}
