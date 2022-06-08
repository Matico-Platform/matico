export interface DatasetRecord {
  name: string;
  id: string;
  parameters?: {[param:string] : any}
}

export interface DatasetProviderComponent{
  onSubmit : (datasetDetails: any) =>void,
  parameters?:{[param:string]:any}
}

export interface DatasetParameterComponent{
  onChange: (newParams: Record<string, any>) => void,
  spec: Record<string,any>
}

export interface DatasetProvider {
  name: string;
  description: string;
  component: React.FC<DatasetProviderComponent>;
  parameterEditor: React.FC<DatasetParameterComponent>
}
