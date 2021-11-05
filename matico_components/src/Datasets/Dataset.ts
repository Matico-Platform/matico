
export enum DatasetState{
  LOADING,
  ERROR,
  READY 
}
export interface Column{
    name: string,
    type : string
}

export enum GeomType{
  Point,
  Polygon,
  Line
}

export interface Datum{
}


export interface RangeFilter{
    variable: string,
    min?: number,
    max?: number
}

export type Filter = RangeFilter

export interface Dataset{
  name: string,
  columns: ()=>Column[],
  getData:(filters?: Array<Filter>) =>Datum[],
  tiled:()=>boolean,
  isReady:()=>boolean,
  geometryType:()=> GeomType,
  onStateChange?:( (state: DatasetState)=>void)
  uniqueForColumn?: (columnName:string)=>Array<string>
}
