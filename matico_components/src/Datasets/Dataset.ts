
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
  Point = "Point",
  Polygon = "Polygon",
  Line = "Line",
  None = "None"
}

//TODO Explicitly type this at some point
export type Datum = any;


export interface RangeFilter{
  variable: string,
  min?: number,
  max?: number
}

export interface CategoryFilter{
    variable: string,
    is_one_of?: Array<string>,
    is_not_one_of?: Array<string>
}

export type Filter = RangeFilter | CategoryFilter

export interface Dataset{
  name: string,
  columns: ()=>Column[],
  getData:(filters?: Array<Filter>, columns?: Array<string>) =>Datum[],
  getDataWithGeo:(filters?: Array<Filter>, columns?:Array<string>) =>Datum[],
  local:()=>boolean,
  tiled:()=>boolean,
  isReady:()=>boolean,
  geometryType:()=> GeomType,
  onStateChange?:( (state: DatasetState)=>void)
  uniqueForColumn?: (columnName:string)=>Array<string>
}
