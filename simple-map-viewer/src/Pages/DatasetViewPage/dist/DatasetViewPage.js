"use strict";
exports.__esModule = true;
exports.DatasetViewPage = void 0;
var react_1 = require("react");
var react_router_1 = require("react-router");
var useDataset_1 = require("../../Hooks/useDataset");
var DatasetViewPageStyles_1 = require("./DatasetViewPageStyles");
var react_2 = require("@deck.gl/react");
var geo_layers_1 = require("@deck.gl/geo-layers");
var react_map_gl_1 = require("react-map-gl");
var DataTable_1 = require("../../Components/DataTable/DataTable");
var DatasetViewDetails_1 = require("../../Components/DatasetViewDetails/DatasetViewDetails");
// import * as d3 from 'd3';
var Layout_1 = require("../../Components/Layout/Layout");
var TOKEN = 'pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw';
var INITIAL_VIEW_STATE = {
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 10,
    pitch: 0,
    bearing: 0
};
var valueToTableEntry = function (value) {
    if (!value) {
        return 'Null';
    }
    else if (typeof value === 'object') {
        return value.type;
    }
    else {
        return value;
    }
};
exports.DatasetViewPage = function (_a) {
    var id = react_router_1.useParams().id;
    var _b = useDataset_1.useDataset(id), dataset = _b.dataset, loading = _b.loading, error = _b.error;
    var _c = react_1.useState(null), selectedRow = _c[0], setSelectedRow = _c[1];
    console.log('Selected row ', selectedRow);
    var layer = dataset
        ? new geo_layers_1.MVTLayer({
            data: window.origin + "/api/tiler/" + dataset.id + "/{z}/{x}/{y}",
            // @ts-ignore
            getFillColor: [140, 170, 180, 90],
            getLineColor: [4, 4, 4],
            getBorderColor: [200, 200, 200],
            getLineWidth: 10,
            getRadius: 20,
            radiusMinPixels: 1,
            radiusMaxPixels: 100,
            getLabel: function (f) { return f.id; },
            stroked: true,
            pickable: true
        })
        : null;
    return (react_1["default"].createElement(Layout_1.Page, null,
        react_1["default"].createElement(Layout_1.DetailsArea, null,
            react_1["default"].createElement("h2", null, loading ? id : dataset === null || dataset === void 0 ? void 0 : dataset.name),
            react_1["default"].createElement("p", null, dataset === null || dataset === void 0 ? void 0 : dataset.description),
            react_1["default"].createElement("p", null,
                "Id column :", dataset === null || dataset === void 0 ? void 0 :
                dataset.id_col,
                " "),
            react_1["default"].createElement("p", null,
                "Geom column : ", dataset === null || dataset === void 0 ? void 0 :
                dataset.geom_col),
            react_1["default"].createElement(Layout_1.FlexSeperator, null),
            react_1["default"].createElement("p", null,
                "Created at: ", dataset === null || dataset === void 0 ? void 0 :
                dataset.created_at),
            react_1["default"].createElement("p", null,
                "Updated at: ", dataset === null || dataset === void 0 ? void 0 :
                dataset.updated_at)),
        react_1["default"].createElement(Layout_1.PageContent, null, dataset && (react_1["default"].createElement(DatasetViewPageStyles_1.Styles.Content, null,
            react_1["default"].createElement(DatasetViewPageStyles_1.Styles.Table, null,
                react_1["default"].createElement(DataTable_1.DataTable, { dataset: dataset, selectedID: selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.id, onSelect: setSelectedRow })),
            react_1["default"].createElement(DatasetViewPageStyles_1.Styles.Map, null,
                react_1["default"].createElement(react_2["default"], { width: '100%', height: '100%', initialViewState: INITIAL_VIEW_STATE, layers: layer ? [layer] : [], controller: true, getTooltip: function (_a) {
                        var object = _a.object;
                        console.log('tool tip ', object);
                        return object && object.message;
                    } },
                    react_1["default"].createElement(react_map_gl_1.StaticMap, { mapboxApiAccessToken: TOKEN, width: '100%', height: '100%', mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' }))),
            react_1["default"].createElement(DatasetViewPageStyles_1.Styles.Details, null,
                react_1["default"].createElement(DatasetViewDetails_1.DataSetViewDetails, null)))))));
};
