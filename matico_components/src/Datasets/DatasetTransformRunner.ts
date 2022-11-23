import {
    AggregateStep,
    AggregationType,
    DatasetTransform,
    DatasetTransformStep,
    ColumnTransformStep,
    FilterStep,
    ColumnTransform,
    JoinStep,
    StringOpts,
    IntOpts,
    DateOpts,
    FloatOpts
} from "@maticoapp/matico_types/spec";
import ColumnTable from "arquero/dist/types/table/column-table";
import { applyFilters, LocalDataset } from "./LocalDataset";
import { op, escape } from "arquero";
import { getGeomType } from "./ArrowBuilder";
import { constructColumnListFromTable } from "./utils";

export interface TransformStepPreview {
    table: Array<Record<string, any>>;
    columns: Array<any>;
    noRows: number;
}

export class TransformStepError extends Error {
    public transformId: string;
    public stepNo: number;
    constructor(
        transformId: string,
        stepNo: number,
        message: string,
        retainStepPreview: boolean = false
    ) {
        super(message);
        this.name = "TransformStepError";
        this.message = message;
        this.transformId = transformId;
        this.stepNo = stepNo;
    }
}

export interface DatasetTransformRunnerInterface extends DatasetTransform {
    retainStepPreview: boolean;
    stepPreviews: Array<TransformStepPreview>;
    requiredDatasets(): Array<string>;
    runTransform(datasets: Record<string, LocalDataset>): ColumnTable;
    applyStep(
        step: DatasetTransformStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable;
    applyColumnTransform(
        step: ColumnTransformStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable;
    applyJoin(
        step: JoinStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable;
    applyFilter(
        step: FilterStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable;
    applyAggregate(
        step: AggregateStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable;
    convertToDate(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: DateOpts
    ): ColumnTable;
    convertToString(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: StringOpts
    ): ColumnTable;
    convertToFloat(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: FloatOpts
    ): ColumnTable;
    convertToInt(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: IntOpts
    ): ColumnTable;
}

function oppTypeToOp(aggType: AggregationType, column: string): any {
    switch (aggType) {
        case "min":
            return op.min(column);
        case "max":
            return op.max(column);
        case "sum":
            return op.sum(column);
        case "mean":
            return op.mean(column);
        case "median":
            return op.median(column);
        case "standardDeviation":
            return op.stdev(column);
        default:
            throw new Error(`Aggregation method not supported : {aggType}`);
    }
}

export class DatasetTransformRunner implements DatasetTransformRunnerInterface {
    id: string;
    name: string;
    description: string;
    sourceId: string;
    steps: DatasetTransformStep[];
    retainStepPreview: boolean;
    public stepPreviews: Array<TransformStepPreview>;

    constructor(
        datasetTransform: DatasetTransform,
        retainStepPreview: boolean
    ) {
        this.id = datasetTransform.id;
        this.retainStepPreview = retainStepPreview;
        this.stepPreviews = [];
        this.name = datasetTransform.name;
        this.description = datasetTransform.description;
        this.sourceId = datasetTransform.sourceId;
        this.steps = datasetTransform.steps;
    }

    applyJoin(
        step: JoinStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable {
        let workingTable = table;
        if (!datasets[step.otherSourceId]) {
            throw new TransformStepError(
                this.id,
                stepNo,
                "Could not find join dataset"
            );
        }

        let otherSource = datasets[step.otherSourceId]._data;
        let joinColumns = [step.joinColumnsLeft, step.joinColumnsRight];

        if (!(step.joinColumnsLeft && step.joinColumnsRight)) {
            return workingTable;
        }
        switch (step.joinType) {
            case "left":
                workingTable = workingTable.join_left(otherSource, joinColumns);
                break;
            case "right":
                workingTable = workingTable.join_right(
                    otherSource,
                    joinColumns
                );
                break;
            case "inner":
                workingTable = workingTable.lookup(
                    otherSource,
                    joinColumns,
                    "cases"
                );
                break;
            case "outer":
                workingTable = workingTable.cross(otherSource, joinColumns);
                break;
        }

        return workingTable;
    }

    convertToDate(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: DateOpts
    ) {
        return table;
    }
    convertToString(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: StringOpts
    ) {
        return table;
    }
    convertToFloat(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: FloatOpts
    ) {
        return table;
    }
    convertToInt(
        table: ColumnTable,
        column: string,
        fromType: string,
        details: FloatOpts
    ) {
        return table;
    }
    applyColumnTransform(
        step: ColumnTransformStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable {
        let workingTable = table;
        step.transforms.each((transform: ColumnTransform) => {
            switch (transform.type) {
                case "rename":
                    workingTable = workingTable.rename({
                        [step.column]: transform.to
                    });
                case "drop":
                    workingTable = workingTable.select(
                        workingTable
                            .toArrow()
                            .schema.fields.map((c) => c.name)
                            .filter((name) => name !== step.column)
                    );
                case "changeType":
                    let fromType = workingTable
                        .toArrow()
                        .schema.fields.find((c) => c.name)?.type;
                    switch (transform.to) {
                        case "date":
                            workingTable = this.convertToDate(
                                workingTable,
                                transform.column,
                                fromType,
                                transform.to
                            );
                        case "string":
                            workingTable = this.convertToString(
                                workingTable,
                                transform.column,
                                fromType,
                                transform.to
                            );
                        case "float":
                            workingTable = this.convertToFloat(
                                workingTable,
                                transform.column,
                                fromType,
                                transform.to
                            );
                        case "int":
                            workingTable = this.convertToInt(
                                workingTable,
                                transform.column,
                                fromType,
                                transform.to
                            );
                    }
            }
        });
        return workingTable;
    }
    applyFilter(
        step: FilterStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable {
        try {
            const filterFunc = (d: Record<string, any>) => {
                let keep = true;
                step.filters.forEach((f) => {
                    if (
                        f.type === "range" &&
                        !(f.max === undefined || f.max === null) &&
                        !(f.min === undefined || f.min === null)
                    ) {
                        if (!(f.min < d[f.variable] && d[f.variable] < f.max)) {
                            keep = false;
                        }
                    }
                    if (
                        f.type === "date" &&
                        !(f.max === undefined || f.max === null) &&
                        !(f.min === undefined || f.min === null)
                    ) {
                        let minParsed =
                            typeof f.min === "string" ? new Date(f.min) : f.min;
                        let maxParsed =
                            typeof f.max === "string" ? new Date(f.max) : f.max;

                        if (
                            !(
                                minParsed < d[f.variable] &&
                                d[f.variable] < maxParsed
                            )
                        ) {
                            keep = false;
                        }
                    }
                    if (f.type === "category") {
                        if (!f.isOneOf.includes(d[f.variable])) {
                            keep = false;
                        }
                    }
                });
                return keep;
            };
            let result = table.filter(escape(filterFunc));
            return result;
        } catch (err) {
            throw new TransformStepError(
                this.id,
                stepNo,
                `Failed to apply filters ${err}`
            );
        }
    }

    applyAggregate(
        step: AggregateStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable {
        let rollUps = step.aggregate.reduce((rollUps, agg) => {
            if (agg.column) {
                return {
                    ...rollUps,
                    [agg.rename ?? `${agg.aggType}_${agg.column}`]: oppTypeToOp(
                        agg.aggType,
                        agg.column
                    )
                };
            } else {
                return rollUps;
            }
        }, {});
        return table.groupby(step.groupByColumns).rollup(rollUps);
    }

    requiredDatasets() {
        return [this.sourceId];
    }

    runTransform(datasets: Record<string, LocalDataset>) {
        let baseTable = datasets[this.sourceId]._data;
        this.stepPreviews = [];

        this.steps.forEach((step, index) => {
            baseTable = this.applyStep(step, baseTable, datasets, index);
            if (this.retainStepPreview) {
                this.stepPreviews.push({
                    table: baseTable.slice(0, 10).objects(),
                    columns: constructColumnListFromTable(baseTable),
                    noRows: baseTable.size
                });
            }
        });
        return baseTable;
    }

    applyStep(
        step: DatasetTransformStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ) {
        switch (step.type) {
            case "join":
                return this.applyJoin(step, table, datasets, stepNo);
            case "filter":
                return this.applyFilter(step, table, datasets, stepNo);
            case "aggregate":
                return this.applyAggregate(step, table, datasets, stepNo);
        }
    }
}
