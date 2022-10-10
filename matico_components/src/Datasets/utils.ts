import { DataType, Field } from "@apache-arrow/es5-cjs";
import ColumnTable from "arquero/dist/types/table/column-table";
import { Column } from "./Dataset";

const arrowTypeToMaticoType = (aType: DataType) => {
    if (
        DataType.isInt(aType) ||
        DataType.isFloat(aType) ||
        DataType.isDecimal(aType)
    ) {
        return "number";
    }
    if (DataType.isBinary(aType)) {
        return "geometry";
    }
    if (DataType.isUtf8(aType)) {
        return "text";
    }
    if (DataType.isDictionary(aType)) {
        return arrowTypeToMaticoType(aType.valueType);
    }
    return "unknown";
};

export const constructColumnListFromTable = (table: ColumnTable) => {
    const columns: Column[] = [];
    table.toArrow().schema.fields.forEach((field: Field) => {
        columns.push({
            name: field.name,
            type: arrowTypeToMaticoType(field.type)
        });
    });
    return columns;
};
