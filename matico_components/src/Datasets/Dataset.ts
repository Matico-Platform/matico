
export interface FilterOptions{
  
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

export interface Dataset{
  name: string,
  columns: ()=>Column[],
  getData:() =>Datum[],
  tiled:()=>boolean,
  isReady:()=>boolean,
  geometryType:()=> GeomType,
}
