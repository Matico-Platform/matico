import { Dataset, Column, GeomType, DatasetState } from "./Dataset";

import {  desc, op, escape, bin} from "arquero";

import _ from "lodash";
//@ts-ignore

import {
    Filter,
} from "@maticoapp/matico_types/spec";

import ColumnTable from "arquero/dist/types/table/column-table";

const applyFilter = (table: ColumnTable, filter: Filter) => {
    switch (filter.type) {
        case "noFilter":
            return table;
        case "range":
            return table.filter(
                (d) =>
                    d[filter.variable] >= filter.min &&
                    d[filter.variable] <= filter.max
            );
        case "category":
            if (filter.isOneOf) {
            }
            return table.filter((d) => {
                let isIn = filter.isOneOf
                    ? filter.isOneOf.includes(d[filter.variable])
                    : true;
                let isOut = filter.isNotOneOf
                    ? !filter.isNotOneOf.includes(d[filter.variable])
                    : true;
                return isIn || isOut;
            });
    }
};

const applyFilters = (table: ColumnTable, filters?: Array<Filter>) => {
    if(!filters) return table;
    let tempTable = table
    filters.forEach((filter)=>{
      tempTable= applyFilter(tempTable,filter)
    })
    return tempTable
};

export class LocalDataset implements Dataset {
    private _isReady: boolean;
    //TODO find a way to make this a more general expression
    private _filterCache: any;

    constructor(
        public name: string,
        public idCol: string,
        private _columns: Array<Column>,
        public _data: ColumnTable,
        public _geometryType: GeomType,
        onStateChange?: (state: DatasetState) => void
    ) {
        this._isReady = true;
        this._filterCache = [];
    }

    isReady() {
        return this._isReady;
    }

    local() {
        return true;
    }
    raster() {
        return false;
    }

    tiled() {
        return false;
    }

    geometryType() {
        return Promise.resolve(this._geometryType);
    }

    columns() {
        return Promise.resolve(this._columns);
    }

    getFeature(feature_id: string) {
        const results = this._data
            .filter((d) => d[this.idCol] === feature_id)
            .object();
        return Promise.resolve(results);
    }

    getArrow() {
        return this._data.toArrowBuffer();
    }

    getColumnMax(column: string, filters?: Array<Filter>) {
        const { max } = applyFilters(this._data, filters)
            .rollup({ max: op.max(column) })
            .object() as {max: number};
        return Promise.resolve(max);
    }

    getColumnMin(column: string, filters?: Array<Filter>) {
        const { min } = applyFilters(this._data, filters)
            .rollup({ min: op.max(column) })
            .object() as { min: number };
        return Promise.resolve(min);
    }

    getColumnSum(column: string, filters?: Array<Filter>) {
        const { sum } = applyFilters(this._data, filters)
            .rollup({
                sum: op.sum("column")
            })
            .object() as { sum: number };

        return Promise.resolve(sum);
    }

    getCategoryCounts(column: string, filters?: Array<Filter>) {
        const counts = applyFilters(this._data, filters)
            .groupby(column)
            .count()
            .orderby(desc("count"))
            .objects() 
            .map( (r: Record<string,any>) => ({name: r[column], count: r.count}))
        return Promise.resolve(counts);
    }

    getCategories(
        column: string,
        noCategories: number,
        filters?: Array<Filter>
    ) {
        const counts = applyFilters(this._data, filters)
            .groupby(column) 
            .count()
            .orderby(desc("count"))
            .array(column) as Array<string | number>;

        return Promise.resolve(counts);
    }

    getEqualIntervalBins(
        column: string,
        bins: number,
        filters?: Array<Filter>
    ) {
        const { max, min } = applyFilters(this._data, filters)
            .rollup({
                min: op.min(column),
                max: op.max(column)
            })
            .object() as { max: number; min: number };

        const binSize = (max - min) / bins;
        let binEdges = [];
        for (let i = 0; i < bins; i++) {
            binEdges.push(min + i * binSize);
        }

        return Promise.resolve(binEdges);
    }

    async getQuantileBins(
        column: string,
        bins: number,
        filters?: Array<Filter>
    ) {
        let quantiles: Record<string, number> = {};
        for (let i = 0; i < bins; i++) {
            const quant = (i + 1) / bins;
            quantiles[quant] = op.quantile(column, quant);
        }
        const result = applyFilters(this._data, filters)
            .rollup(quantiles)
            .object();

        return Promise.resolve(Object.values(result));
    }

    async getJenksBins(column: string, bins: number, filters?: Array<Filter>) {
        return Promise.resolve([]);
        throw Error("function not implemented");
    }

    async getColumnHistogram(
        column: string,
        noBins: number,
        filters?: Array<Filter>
    ) {
        let result = applyFilters(this._data, filters)
            .groupby({ bin: bin(column, {maxbins:noBins}) })
            .count()
            .impute(
            { count: () => 0 }, // set imputed counts to zero
            { expand: { bin: d => op.sequence(...op.bins(d.bin)) } } 
          )
          .orderby('bin')
          .objects() as Array<{ bin: number; count: number }>;

        const binSize = result[1].bin - result[0].bin
        let mappedResult = result.map((r,index) => ({
            binStart: r.bin ,
            binEnd: r.bin+binSize ,
            binMid: r.bin+0.5*binSize,
            freq: r.count
        }));

        return Promise.resolve(mappedResult);
    }

    async getData(
        filters?: Array<Filter>,
        columns?: Array<string>,
        limit?: number
    ) {
        const cacheKey = JSON.stringify([filters, columns]);
        if (this._filterCache[cacheKey]) {
            return this._filterCache[cacheKey];
        }
        const results = applyFilters(this._data, filters ?? [])
            .select(columns)
            .objects({ limit });

        this._filterCache[JSON.stringify(filters)] = results;
        return results;
    }
}
