
export type DatasetQuery = {
  datasetName: string,
  column: string;
  metric: string;
  parameters?: Record<string, any>
}

export type BinnedValue = {
  binStart: number,
  binEnd: number,
  binMid: number,
  freq: number
}

export type CategoryCount = {
  name: string,
  count: number
}

export type DatasetQueryValue =
  number |
  string |
  Array<number | string> |
  Array<BinnedValue> |
  { min: number, max: number } |
  CategoryCount


export type QueryResult = {
  query: DatasetQuery,
  result?: DatasetQueryValue,
  error?: string
}
