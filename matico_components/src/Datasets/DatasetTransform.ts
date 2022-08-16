import {
    AggregateStep,
    AggregationType,
    DatasetTransform as DatasetTransformBase,
    DatasetTransformStep,
    FilterStep,
    JoinStep
} from "@maticoapp/matico_types/spec";
import ColumnTable from "arquero/dist/types/table/column-table";
import { applyFilters, LocalDataset } from "./LocalDataset";
import { op } from "arquero";

export class TransformStepError extends Error {
    public transformId: string;
    public stepNo: number;

    constructor(transformId: string, stepNo: number, message: string) {
        super(message);
        this.name = "TransformStepError";
        this.message = message;
        this.transformId = transformId;
        this.stepNo = stepNo;
    }
}

export interface DatasetTransformInterface extends DatasetTransformBase {
    requiredDatasets(): Array<string>;
    runTransform(datasets: Record<string, LocalDataset>): ColumnTable;
    applyStep(
        step: DatasetTransformStep,
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
}

function oppTypeToOp(aggType: AggregationType): any {
    switch (aggType) {
        case "min":
            return op.min;
        case "max":
            return op.max;
        case "sum":
            return op.sum;
        case "mean":
            return op.mean;
        case "median":
            return op.median;
        case "standardDeviation":
            return op.stdev;
        default:
            throw new Error(`Aggregation method not supported : {aggType}`);
    }
}

export class DatasetTransform implements DatasetTransformInterface {
    id: string;
    name: string;
    description: string;
    sourceId: string;
    steps: DatasetTransformStep[];

    constructor(datasetTransform: DatasetTransformBase) {
        this.id = datasetTransform.id;
        (this.name = datasetTransform.name),
            (this.description = datasetTransform.description),
            (this.sourceId = datasetTransform.sourceId),
            (this.steps = datasetTransform.steps);
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

        if (
            step.joinColumnsLeft.length === 0 ||
            step.joinColumnsRight.length === 0
        ) {
            throw new TransformStepError(
                this.id,
                stepNo,
                "Add at least one join column"
            );
        }

        let otherSource = datasets[step.otherSourceId]._data;
        let joinColumns = [step.joinColumnsLeft, step.joinColumnsRight];

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
                workingTable = workingTable.join(otherSource, joinColumns);
                break;
            case "outer":
                workingTable = workingTable.cross(otherSource, joinColumns);
                break;
        }
        return workingTable;
    }

    applyFilter(
        step: FilterStep,
        table: ColumnTable,
        datasets: Record<string, LocalDataset>,
        stepNo: number
    ): ColumnTable {
        try {
            return applyFilters(table, step.filters);
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
        let rollUps = step.aggregate.reduce(
            (rollUps, agg) => ({
                ...rollUps,
                [agg.rename]: oppTypeToOp(agg.aggType)(agg.column)
            }),
            {}
        );
        return table.groupby(step.groupByColumns).rollup(rollUps);
    }

    requiredDatasets() {
        return [this.sourceId];
    }

    runTransform(datasets: Record<string, LocalDataset>) {
        let baseTable = datasets[this.sourceId]._data;
        this.steps.forEach((step, index) => {
            baseTable = this.applyStep(step, baseTable, datasets, index);
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
