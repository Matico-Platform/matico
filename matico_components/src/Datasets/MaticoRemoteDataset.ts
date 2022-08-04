import {
  Column,
  Dataset,
  DatasetState,
  Filter,
  GeomType,
  HistogramBin,
} from "./Dataset";
import axios from "axios";

export class MaticoRemoteDataset implements Dataset {
  name: string;
  datasetId: string;
  token: string;
  serverUrl: string;
  idCol: string;
  _axiosInstance: any;

  constructor(
    name: string,
    datasetId: string,
    serverUrl: string,
    token?: string
  ) {
    this.name = name;
    this.datasetId = datasetId;
    this.serverUrl = serverUrl;
    this.token = token;

    const headers: { [header: string]: string } = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    this._axiosInstance = axios.create({
      baseURL: serverUrl + `/datasets/${datasetId}`,
      headers,
    });
  }

  async _queryServer(path: string, params?: { [param: string]: any }) {
    const queryResults = await this._axiosInstance(path, { params });
    return queryResults.data;
  }

  async columns() {
    const serverColumns = await this._queryServer("/columns");
    const typeMappings: { [postgisType: string]: any } = {
      INT4: "number",
      INT8: "number",
      FLOAT: "number",
      VARCHAR: "string",
    };
    return serverColumns.map((sc) => ({
      name: sc.name,
      type: typeMappings[sc.col_type] ?? sc.col_type,
    }));
  }

  getData(filters?: Filter[], columns?: string[]) {
    return this._queryServer("/data");
  }

  getDataWithGeo(filters?: Filter[], columns?: string[]) {
    return this._queryServer("/data");
  }

  getFeature(feature_id: string) {
    return this._queryServer(`feature/${feature_id}`);
  }
  local() {
    return false;
  }
  tiled() {
    return true;
  }
  mvtUrl() {
    return `${this.serverUrl}/tiler/dataset/${this.datasetId}/{z}/{x}/{y}`;
  }
  isReady() {
    return true;
  }
  async geometryType() {
    let columns = await this.columns();
    return columns.find((c: Column) => c.type === "geometry")?.type;
  }

  async getColumnMax(column: string) {
    const statParams = {
      stat: JSON.stringify({ BasicStatParams: { treat_null_as_zero: true } }),
    };

    let stats = await this._queryServer(`/columns/${column}/stats`, statParams);
    return stats.max;
  }

  async getColumnMin(column: string) {
    const statParams = {
      stat: JSON.stringify({ BasicStatParams: { treat_null_as_zero: true } }),
    };

    let stats = await this._queryServer(`/columns/${column}/stats`, statParams);
    return stats.min;
  }

  async getColumnSum(column: string) {
    const statParams = {
      stat: JSON.stringify({ BasicStatParams: { treat_null_as_zero: true } }),
    };

    let stats = await this._queryServer(`/columns/${column}/stats`, statParams);
    return stats.sum;
  }

  async getCategoryCounts(column: string, filters?: Filter[]) {
    const statParams = {
      stat: JSON.stringify({ ValueCounts: { ignore_null: true } }),
    };

    let categoryCounts = await this._queryServer(
      `/columns/${column}/stats`,
      statParams
    );
    return categoryCounts;
  }

  async getColumnHistogram(column: string, noBins: number, filters?: Filter[]) {
    const statParams = {
      stat: JSON.stringify({
        Histogram: { no_bins: noBins, treat_null_as_zero: false },
      }),
    };

    let result = await this._queryServer(
      `/columns/${column}/stats`,
      statParams
    );

    result = result.Histogram;

    return result.map((bin: any) => ({
      count: bin.freq,
      binStart: bin.bin_start,
      binEnd: bin.bin_end,
    }));
  }

  async getEqualIntervalBins(column: string, bins: number, filters?: Filter[]) {
    const statParams = {
      stat: JSON.stringify({
        Percentiles: { no_bins: bins, treat_null_as_zero: false },
      }),
    };

    let result = await this._queryServer(
      `/columns/${column}/stats`,
      statParams
    );
    return result;
  }

  // TODO implement backend quantile bins
  async getQuantileBins(column: string, bins: number, filters?: Filter[]) {
    const statParams = {
      stat: JSON.stringify({
        Quantiles: { no_bins: bins, treat_null_as_zero: false },
      }),
    };

    let result = await this._queryServer(
      `/columns/${column}/stats`,
      statParams
    );
    return result.Quantiles.map((q: any) => q.bin_end);
  }
  //TODO implement backend jenks bins
  getJenksBins: (
    column: string,
    bins: number,
    filters?: Filter[]
  ) => Promise<number[][]>;

  //TODO implement invalidation and updates
  onStateChange(reportState: (state: DatasetState) => void) {}
}
