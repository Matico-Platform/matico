export interface QueryParameter {
    name: string;
    description: string;
    default_value: Record<string, unknown>;
}

export interface Query {
    id: string;
    name: string;
    description: string;
    sql: string;
    parameters: Array<QueryParameter>;
}

export interface ValueCount {
    name: string;
    count: number;
}
