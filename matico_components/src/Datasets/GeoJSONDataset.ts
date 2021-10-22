import {Dataset, Column, Datum, GeomType} from './Dataset'
import traverse from 'traverse'

export class GeoJSONDataset implements Dataset {
  private _isReady: boolean;
  //TODO find a way to make this a more general expression
  private _data: any; 
  private _columns: Column[]; 
  private _geometryType; GeomType;

  constructor(
    public name : string, 
    public url: string, 
  ){
    this._isReady = false
    fetch(url).then((r)=>r.json()).then((result:any)=>{
      this._data = result
      this._columns = this._extractColumns()
      this._geometryType= this._extractGeomType()
      this._isReady = true
    })
  }

  private _extractGeomType(){
    return GeomType.Point
  }
 
  private _extractColumns(){
   let a= traverse(this._data.features).reduce(function(acc,node){
     if(  this.key==='properties'){
       this.keys.forEach((k)=> acc[k] = {name: k, type: typeof(k)})
     }
      return acc
    },{})
    return Object.values(a) as Column[] 
  }

  isReady(){
    return this._isReady 
  }

  tiled(){
    return false
  }

  geometryType(){
    return this._geometryType
  } 

  columns(){
    return this._columns 
  }

  getData(){
    return this._data 
  }

}
