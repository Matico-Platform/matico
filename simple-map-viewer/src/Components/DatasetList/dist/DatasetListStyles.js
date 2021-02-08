"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.Styles = void 0;
var styled_components_1 = require("styled-components");
var Layout_1 = require("../Layout/Layout");
var DatasetListOuter = styled_components_1["default"](Layout_1.Paper)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    width: 100%;\n"], ["\n    width: 100%;\n"])));
var DatasetList = styled_components_1["default"].ul(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var DatasetRow = styled_components_1["default"].li(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    border-bottom: 1px solid lightgrey;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 20px;\n    color: grey;\n\n    a {\n        margin-right: 10px;\n    }\n    :last-child {\n        border: none;\n    }\n"], ["\n    border-bottom: 1px solid lightgrey;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 20px;\n    color: grey;\n\n    a {\n        margin-right: 10px;\n    }\n    :last-child {\n        border: none;\n    }\n"])));
exports.Styles = {
    DatasetListOuter: DatasetListOuter,
    DatasetList: DatasetList,
    DatasetRow: DatasetRow
};
var templateObject_1, templateObject_2, templateObject_3;
