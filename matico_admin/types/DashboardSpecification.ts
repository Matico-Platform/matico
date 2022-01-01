import {BaseMap, MapStyle,Layer} from './LayerSpecification'
import {DatasetSource} from './Sources'
import {Dashboard as AppSpec} from '@maticoapp/matico_spec'

export interface Component{
  name: string,
  description: string,
}

export interface Screen{
  name: string,
  components: Component[],
}

export interface Dashboard{
  name: string,
  description:string,
 // screens: Screee[],
  id: string, 
  owner_id: string,
  public:boolean,
  spec: AppSpec, 
  created_at: Date,
  updated_at: Date
}

export interface MapComponent extends Component{
  lat:number,
  lng:number,
  base_map: BaseMap,
  layers: Layer[]
} 


export interface ScatterPlotComponent extends Component{
  xrange: [number,number],
  yrange: [number,number],
  dataDource: DatasetSource,
}


export interface LinePlotComponent extends Component{
  xrange: [number,number],
  yrange: [number,number],
  xVar: string,
  yVar: string,
  dataSource: DatasetSource,
}

// Types for interacting with the API

export interface CreateDashboardDTO {
    name: string;
    description: string;
    public: boolean;
    spec: AppSpec ;
}

export interface UpdateDashboardDTO {
    name?: string;
    description?: string;
    public?: boolean;
    spec?: AppSpec;
}
