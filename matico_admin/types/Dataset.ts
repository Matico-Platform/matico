export interface Dataset {
  name: string;
  description: string;
  id: string;
  created_at: Date;
  updated_at: Date;
  geom_col: string;
  id_col: string;
}

export interface Column {
  name: string;
  col_type: string;
  source_query: string;
}
