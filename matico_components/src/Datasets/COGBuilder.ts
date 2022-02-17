import React from 'react';
import {COGDataset} from './COGDataset'

interface COGBuilderOptions{
  name: string;
  url: string;
  description: string;
}

export const COGBuilder= (details: COGBuilderOptions)=>{
  const {name,url,description} = details

  return new COGDataset(name,url,description)
}
