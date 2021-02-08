"use strict";
exports.__esModule = true;
exports.DatasetList = void 0;
var react_1 = require("react");
var useDatasets_1 = require("../../Hooks/useDatasets");
var DatasetListStyles_1 = require("./DatasetListStyles");
var Button_1 = require("../Button/Button");
var react_router_dom_1 = require("react-router-dom");
exports.DatasetList = function (_a) {
    var _b = useDatasets_1.useDatasets(), datasets = _b.datasets, loading = _b.loading;
    return (react_1["default"].createElement(DatasetListStyles_1.Styles.DatasetListOuter, null, loading ? (react_1["default"].createElement("h3", null, "Loading...")) : (react_1["default"].createElement(DatasetListStyles_1.Styles.DatasetList, null, datasets.map(function (dataset) { return (react_1["default"].createElement(DatasetListStyles_1.Styles.DatasetRow, null,
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h3", null, dataset.name),
            react_1["default"].createElement("p", null, dataset.description)),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement(react_router_dom_1.Link, { to: "/datasets/" + dataset.id },
                react_1["default"].createElement(Button_1.Button, { kind: Button_1.ButtonType.Secondary }, "view")),
            react_1["default"].createElement(react_router_dom_1.Link, { to: "/datasets/" + dataset.id },
                react_1["default"].createElement(Button_1.Button, { kind: Button_1.ButtonType.Primary }, "delete"))))); })))));
};
