import {
  scaleLinear,
  scaleBand,
  scaleLog,
  scalePower,
  scaleSqrt,
  scaleTime,
} from "@visx/scale";

export const scaleMapping = {
  linear: scaleLinear,
  log: scaleLog,
  power: scalePower,
  sqrt: scaleSqrt,
  band: scaleBand,
  time: scaleTime,
};