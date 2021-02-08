"use strict";
exports.__esModule = true;
exports.DatasetsPage = void 0;
var react_1 = require("react");
var DatasetCreationForm_1 = require("../../Components/DatasetCreationForm/DatasetCreationForm");
var DatasetList_1 = require("../../Components/DatasetList/DatasetList");
var DatasetsPageStyles_1 = require("./DatasetsPageStyles");
var Layout_1 = require("../../Components/Layout/Layout");
var Button_1 = require("../../Components/Button/Button");
var Layout_2 = require("../../Components/Layout/Layout");
exports.DatasetsPage = function (_a) {
    return (react_1["default"].createElement(Layout_2.Page, null,
        react_1["default"].createElement(Layout_2.DetailsArea, null,
            react_1["default"].createElement("h1", null, "Datasets"),
            react_1["default"].createElement(Layout_1.FlexSeperator, null),
            react_1["default"].createElement(Button_1.Button, { kind: Button_1.ButtonType.Primary }, "Add Datasets")),
        react_1["default"].createElement(DatasetsPageStyles_1.Styles.DatasetsPage, null,
            react_1["default"].createElement(DatasetList_1.DatasetList, null),
            react_1["default"].createElement(DatasetCreationForm_1.DatasetCreationForm, null))));
};
