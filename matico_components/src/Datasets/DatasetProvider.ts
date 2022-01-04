export interface DatasetRecord {
  name: string;
  id: string;
  parameters?: {[param:string] : any}
}

export interface DatasetProviderComponent{
  onSubmit : (datasetDetails: any) =>void
}

export interface DatasetProvider {
  name: string;
  description: string;
  component: React.FC<DatasetProviderComponent>;
}
