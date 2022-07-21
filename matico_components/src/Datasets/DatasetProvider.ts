import { DatasetSpec, SpecParameter} from "@maticoapp/matico_types/spec";
export interface DatasetRecord {
    name: string;
    id: string;
    parameters?: Array<SpecParameter>;
}

export interface DatasetProviderComponent {
    onSubmit: (datasetDetails: DatasetSpec) => void;
    parameters?: Array<SpecParameter>;
}

export interface DatasetParameterComponent {
    onChange: (newParams: Record<string, any>) => void;
    spec: DatasetSpec;
}

export interface DatasetProvider {
    name: string;
    description: string;
    component: React.FC<DatasetProviderComponent>;
    parameterEditor: React.FC<DatasetParameterComponent>;
}
