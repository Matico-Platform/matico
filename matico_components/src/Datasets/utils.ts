import { Column } from "./Dataset";
import { Field, Utf8, Int32, Float32 } from "@apache-arrow/es5-cjs";

export const constructColumnListFromSample = (sample: Array<any>) => {
  const fields = [];
  const columns: Column[] = [];
  Object.entries(sample).forEach(([name, value]) => {
    if (typeof value === "string") {
      fields.push(new Field(name, new Utf8(), true));
      columns.push({ name, type: "string" });
    } else if ((value as number) % 1 === 0) {
      fields.push(new Field(name, new Int32(), true));
      columns.push({ name, type: "number" });
    } else {
      fields.push(new Field(name, new Float32(), true));
      columns.push({ name, type: "number" });
    }
  });
  return { columns, fields };
};
