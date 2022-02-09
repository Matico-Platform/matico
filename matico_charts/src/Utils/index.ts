import { ColorOutput } from "../components/types";
import { MarginCalculation } from "./utils.types";

export const isString = (x: any) => "string" === typeof x;
export const isFunc = (x: any) => "function" === typeof x;
export const isArray = (x: any) => Array.isArray(x);
export const isBool = (x: any) => "boolean" === typeof x;
export const isObj = (x: any) => "object" === typeof x;

export const getBoolOrProperty = (
  boolOrObj: boolean | object | undefined,
  defaultValue: boolean | string,
  prop: string
) => {
  if (isBool(boolOrObj)) return boolOrObj; //@ts-ignore
  if (isObj(boolOrObj) && boolOrObj[prop]) return boolOrObj[prop];
  return defaultValue;
};

export const sanitizeColor = (color: ColorOutput) => {
  if (!color) return null;
  if (isString(color)) return color;
  if (isArray(color)) {
    //@ts-ignore
    return `rgb${color.length === 4 ? "a" : ""}(${color.join(",")})`;
  }
  return "lightgray";
};

export const generateMargins = ({
  xAxis,
  yAxis,
  xLabel,
  yLabel,
  attribution,
  title,
  subtitle,
  categorical,
}: MarginCalculation) => {
  let margin = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
  if (title) {
    margin.top += 50;
  }
  if (subtitle) {
    margin.top += 10;
  }
  if (attribution) {
    margin.bottom += 10;
  }
  if (categorical) {
    return margin;
  }
  margin.left += 20;
  margin.bottom += 20;
  margin.right += 20;
  if (yAxis) {
    if (!isBool(yAxis)) {
      //@ts-ignore
      if (yAxis.position === "left") margin.left += 35;
      //@ts-ignore
      if (yAxis.position === "right") margin.right += 35;
    } else {
      margin.left += 40;
    }
  }
  if (xAxis) {
    if (!isBool(xAxis)) {
      //@ts-ignore
      if (xAxis.position === "top") margin.top += 20;
      //@ts-ignore
      if (xAxis.position === "bottom") margin.bottom += 20;
    } else {
      margin.bottom += 40;
    }
  }
  if (yLabel) {
    if (yAxis && !isBool(yAxis)) {
      //@ts-ignore
      if (yAxis.position === "left") margin.left += 0;
      //@ts-ignore
      if (yAxis.position === "right") margin.right += 0;
    } else {
      margin.left += 30;
    }
  }
  if (xLabel) {
    if (xAxis && !isBool(xAxis)) {
      //@ts-ignore
      if (xAxis.position === "top") margin.top += 0;
      //@ts-ignore
      if (xAxis.position === "bottom") margin.bottom += 0;
    } else {
      margin.bottom += 30;
    }
  } else {
    if (attribution) {
      margin.bottom += 10;
    }
  }
  if (subtitle) {
    margin.top += 10;
  }
  return margin;
};

export const getTitleOffset = (
  title: string | boolean | undefined,
  subtitle: string | boolean | undefined,
  xAxisPos: string | boolean | undefined
) => {
  let offset = 0;
  if (title) offset -= 0;
  if (subtitle) offset -= 10;
  if (xAxisPos === "top") offset -= 40;
  return offset;
};
