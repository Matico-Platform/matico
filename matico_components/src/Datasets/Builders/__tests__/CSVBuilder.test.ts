import { CSVBuilder } from '../CSVBuilder'
import dataServer from '__tests__/mockDataServer'

describe("CSVBuilder", () => {
  dataServer()
  it("should correctly parse a CSV when it's valid", async () => {
    let dataset = await CSVBuilder({
      name: "/data/simple_csv.csv",
      url: "https://data.com/simple.csv",
      latCol: "latitude",
      lngCol: "longitude",
      idColumn: "id"
    })

    expect(dataset).toBeDefined()
    let columns = await dataset.columns()
    expect(columns).toStrictEqual([
      { name: 'latitude', type: 'number' },
      { name: 'longitude', type: "number" },
      { name: "id", type: 'number' },
      { name: "value1", type: 'number' },
      { name: "value2", type: 'text' },
      { name: "geom", type: "geometry" },
      { name: "_matico_id", type: "number" },
    ])
  })

  it("should throw an error when latitude is missing from the csv", async () => {

    let dataset = CSVBuilder({
      name: "/data/simple_csv.csv",
      url: "https://data.com/simple.csv",
      latCol: "lat",
      lngCol: "longitude",
      idColumn: "id"
    })
    await expect(dataset).rejects.toThrowError("CSV file does not contain specified lat col: lat");
  })

  it("should throw an error when longitude is missing from the csv", async () => {

    let dataset = CSVBuilder({
      name: "/data/simple_csv.csv",
      url: "https://data.com/simple.csv",
      latCol: "latitude",
      lngCol: "lng",
      idColumn: "id"
    })
    await expect(dataset).rejects.toThrowError(Error(`CSV file does not contain specified lng col: lng`));

  })
})
