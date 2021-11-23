import { Table, DataFrame } from "@apache-arrow/es5-cjs";
import { Column } from "./Dataset";
import { LocalDataset } from "./LocalDataset";
import { GeomType } from "./Dataset";

const arrowToJSType = (vType: any) => {
  switch (vType) {
    case "Int":
    case "Float":
      return "number";
    case "String":
      return "string";
    default:
      return "unknown";
  }
};

export class FeatherBuilder {
  constructor(
    public name: string,
    public _url: string,
    onDone: (result: LocalDataset) => void
  ) {
    Table.fromAsync(
      fetch(
        "https://allofthedata.s3.us-west-2.amazonaws.com/taxi_small.feather"
      )
    ).then((table) => {
      const columns = this.extract_columns(table);
      const dataFrame = new DataFrame(table);
      const geomType = GeomType.Point;
      const idCol = "id";

      onDone(new LocalDataset(name, idCol, columns, dataFrame, geomType));
    });
  }

  extract_columns(table: Table) {
    return table.schema.fields.map((f) => ({
      name: f.name,
      type: arrowToJSType(f.type),
    })) as Column[];
  }
}
