import { DatasetService } from '../NewDatasetService'
import dataServer from '__tests__/mockDataServer'
import { Dataset, DatasetTransform } from '@maticoapp/matico_types/spec'
import { vi } from 'vitest'
import { DatasetQuery, QueryResult } from 'Datasets/DatasetQueries'

const csvDataset: Dataset = {
  name: "testDataset",
  type: 'csv',
  url: "https://data.com/simple.csv",
  latCol: "latitude",
  lngCol: "longitude",
  idColumn: "id"
}

const exampleTransform: DatasetTransform = {
  sourceId: "testDataset",
  steps: [],
  name: "testTransform",
  description: "Testing the transform"

}

const exampleQuery: DatasetQuery = {
  datasetName: 'testDataset',
  column: "value1",
  metric: "extent",
}

describe("DatasetService", () => {
  dataServer()
  it("Should correctly register a CSV dataset", async () => {
    const datasetService = new DatasetService()
    await datasetService.registerOrUpdateDataset(csvDataset)
    expect(datasetService._datasets).toHaveProperty("testDataset")
  })

  it("Should correctly unregister a dataset when requested", async () => {
    const datasetService = new DatasetService()
    await datasetService.registerOrUpdateDataset(csvDataset)

    await datasetService.unregisterDataset("testDataset")
    expect(datasetService._datasets).not.toHaveProperty("testDataset")
  })

  it("Should handle a dataset query correctly ", async () => {
    const datasetService = new DatasetService()
    await datasetService.registerOrUpdateDataset(csvDataset)
    const queryResult = await datasetService.registerDatasetQuery(exampleQuery)
    expect(queryResult.result).toStrictEqual({ min: 23, max: 600 })
  })

  it("Should update a dataset query when the dataset changes", async () => {
    const onUpdateQuery = vi.fn((_: QueryResult) => { });

    const datasetService = new DatasetService()
    await datasetService.registerOrUpdateDataset(csvDataset)
    await datasetService.registerDatasetQuery(exampleQuery, onUpdateQuery)

    const newDataset = { ...csvDataset, url: "https://data.com/simple2.csv" }
    await datasetService.registerOrUpdateDataset(newDataset)
    expect(datasetService._notificationSubscriptions).toHaveProperty(csvDataset.name)

    await new Promise((resolve, _) => setTimeout(resolve, 0))

    expect(onUpdateQuery).toBeCalledWith({ query: exampleQuery, result: { min: 10, max: 1000 } })
  })

  it("Should correctly register a Dataset Transform", async () => {

  })
})
