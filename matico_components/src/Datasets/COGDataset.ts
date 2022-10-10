import {
    Column,
    Dataset,
    DatasetState,
    Filter,
    GeomType,
    HistogramBin
} from "./Dataset";

export class COGDataset implements Dataset {
    name: string;
    url: string;
    description: string;

    constructor(name: string, url: string, description: string) {
        this.name = name;
        this.url = url;
        this.description = description;
    }
    idCol: string;
    columns() {
        return Promise.resolve([]);
    }
    getData(filters?: Filter[], columns?: string[]) {
        return Promise.resolve([]);
    }
    getDataWithGeo(filters?: Filter[], columns?: string[]) {
        return Promise.resolve([]);
    }

    getFeature(feature_id: string) {
        return Promise.resolve([]);
    }
    local() {
        return false;
    }
    tiled() {
        return true;
    }
    raster() {
        return true;
    }
    mvtUrl() {
        return `http://localhost:8001/cog/tiles/{z}/{x}/{y}?scale=1&format=jpeg&TileMatrixSetId=WebMercatorQuad&url=${this.url}&bidx=1&expression=b1&unscale=false&resampling=nearest&rescale=-0.937%2C24.4466&colormap_name=cubehelix&return_mask=true`;
    }
    isReady() {
        return true;
    }
    geometryType() {
        return Promise.resolve(null);
    }

    onStateChange() {
        return () => {};
    }
    getColumnMax(column: string) {
        return Promise.resolve(10);
    }
    getColumnMin(column: string) {
        return Promise.resolve(20);
    }
    getColumnSum() {
        return Promise.resolve(30);
    }
    getColumnHistogram(column: string) {
        return Promise.resolve([]);
    }
    getCategoryCounts(columns: string, filters?: Filter[]) {
        return Promise.resolve({});
    }
    getEqualIntervalBins(column: string, bins: number, filters?: Filter[]) {
        return Promise.resolve([]);
    }
    getQuantileBins(column: string, bins: number, filters?: Filter[]) {
        return Promise.resolve([]);
    }
    getJenksBins(column: string, bins: number, filters?: Filter[]) {
        return Promise.resolve([[20]]);
    }
}
