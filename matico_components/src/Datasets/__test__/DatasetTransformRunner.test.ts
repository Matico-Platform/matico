import { DatasetTransform } from "@maticoapp/matico_types/spec"
import { DatasetTransformRunner } from "Datasets/DatasetTransformRunner"
import { table } from 'arquero'

let datasets = [

]

let transform: DatasetTransform = {
  id: "someTransform",
  name: "someTransform",
  description: "a dataset transform",
  steps: [],
  sourceId: "sourceDataset"
}

describe("DatasetTransformRunner", () => {
  it("Should return the input dataset when no steps defined", () => {
    let transformRunner = new DatasetTransformRunner(
      transform,
      false
    )
  })

  it("Should perform multiple steps", () => {

  })

  it("Should succesfully perform an aggregation", () => {

  })

  it("Should succesfully perform a join", () => {

  })

  it("Should succesfully perform a filter", () => {

  })

  it("Should run when the input is another transform", () => {

  })
})
