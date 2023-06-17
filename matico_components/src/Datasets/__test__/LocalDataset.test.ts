import { LocalDataset } from "Datasets/LocalDataset"
import { table } from "arquero"
import { GeomType } from "Datasets/Dataset";
import { range } from "lodash"

const categories = ["cat1", "cat2", "cat3", "cat4"]

const makeLocalDataset = () => {
  let data = table({
    "value1": range(101),
    "value2": range(101).map((i) => categories[i % 4])
  });

  return new LocalDataset(
    "testDataset",
    "id",
    [{ name: "value1", type: "number" }, { name: "value2", type: "text" }],
    data,
    GeomType.None
  )
}

describe("Local Dataset", () => {

  it("Should correctly compute a equal interval bins", async () => {
    let localDataset = makeLocalDataset()
    let bins = await localDataset.getEqualIntervalBins("value1", 10)
    expect(bins.length).toBe(10)
    expect(bins).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
  })

  it('should correctly compute category counts', async () => {
    let localDataset = makeLocalDataset()
    let counts = await localDataset.getCategoryCounts("value2")
    expect(counts).toEqual(
      [
        { name: "cat1", count: 26 },
        { name: "cat2", count: 25 },
        { name: "cat3", count: 25 },
        { name: "cat4", count: 25 }
      ])
  })

  it("Should correctly compute min max", async () => {
    let localDataset = makeLocalDataset()
    let minMax = await localDataset.getColumnExtent("value1")
    expect(minMax.max).toBe(100)
    expect(minMax.min).toBe(0)
  })

  it("Should correctly get a columns categories", async () => {
    let localDataset = makeLocalDataset()
    let computedCategories = await localDataset.getCategories("value2")
    expect(computedCategories).toEqual(categories)
  })

  it("Should correctly get a columns categories with limit", async () => {
    let localDataset = makeLocalDataset()
    let computedCategories = await localDataset.getCategories("value2", 2)
    expect(computedCategories.length).toBe(2)
  })


  it("Should get the max of a column ", async () => {
    let localDataset = makeLocalDataset()
    let max = await localDataset.getColumnMax("value1")
    expect(max).toBe(100)
  })

  it("Should get the min of a column ", async () => {
    let localDataset = makeLocalDataset()
    let min = await localDataset.getColumnMin("value1")
    expect(min).toBe(0)
  })

  it("Should correctly sum a column", async () => {
    let localDataset = makeLocalDataset()
    let sum = await localDataset.getColumnSum("value1")
    expect(sum).toBe(5050)
  })

  it("Should correctly get a columns Quantile bins", async () => {
    let localDataset = makeLocalDataset()
    let quantiles = await localDataset.getQuantileBins("value1", 4)
    expect(quantiles).toEqual([25, 50, 75, 100])
  })

  it("Should correctly calculate a columns histogram", async () => {
    let localDataset = makeLocalDataset()
    let hist = await localDataset.getColumnHistogram("value1", 4)
    expect(hist).toEqual([
      { bin: 0, count: 25 },
      { bin: 1, count: 25 },
      { bin: 2, count: 25 },
      { bin: 3, count: 25 }
    ])

  })
})
