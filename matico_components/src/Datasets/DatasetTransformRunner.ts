import {
    AggregateStep,
    AggregationType,
    DatasetTransform,
    DatasetTransformStep,
    FilterStep,
    JoinStep
} from "@maticoapp/matico_types/spec";
import ColumnTable from "arquero/dist/types/table/column-table";
import { applyFilters, LocalDataset } from "./LocalDataset";
import { op, escape} from "arquero";

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

export interface DatasetTransformRunnerInterface extends DatasetTransform {
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

function oppTypeToOp(aggType: AggregationType, column:string): any {
    console.log("getting op type for ", aggType);
    switch (aggType) {
        case "min":
            console.log("retruning min");
            return op.min(column);
        case "max":
            console.log("retruning max");
            return op.max(column);
        case "sum":
            console.log("retruning sum");
            return op.sum(column);
        case "mean":
            console.log("retruning mean");
            return op.mean(column);
        case "median":
            console.log("retruning median");
            return op.median(column);
        case "standardDeviation":
            console.log("retruning stddev");
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

    constructor(datasetTransform: DatasetTransform) {
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


        let otherSource = datasets[step.otherSourceId]._data;
        let joinColumns = [step.joinColumnsLeft, step.joinColumnsRight];
  
        if(!(step.joinColumnsLeft && step.joinColumnsRight)){
          return workingTable
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
          const filterFunc  = (d: Record<string,any>)=>{
              let keep = true 
              step.filters.forEach(f=>{
                if(f.type==='range' && f.max && f.min){
                  if(!(f.min < d[f.variable]  &&  d[f.variable] < f.max)) {
                  keep = false 
                  }
                }
                if(f.type==='category'){
                  if(!f.isOneOf.includes(d[f.variable])){
                    keep = false
                  }
                }
              })
              return keep
          }
          return table.filter(escape(filterFunc))
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
                [agg.rename ?? `${agg.aggType}_${agg.column}`]:  oppTypeToOp(
                    agg.aggType,
                    agg.column
                )
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
