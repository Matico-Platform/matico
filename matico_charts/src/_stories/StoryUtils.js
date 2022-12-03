import { linearRegression, linearRegressionLine } from "simple-statistics";
import genStats, { Stats } from "@visx/mock-data/lib/generators/genStats";
import { getSeededRandom, getRandomNormal } from "@visx/mock-data";
import * as d3 from "d3";

// samplepoly2 has the coordinates drawn counterclockwise and
// samplepoly3 has coordinates drawn clockwise

export const generate2dData = (n) =>
  Array(n)
    .fill(0)
    .map((_, i) => ({
      x_column: Math.random() * Math.sqrt(i),
      y_column: Math.random() * (i + 50) * 2,
      r_column: Math.floor(Math.random() * 10) + 1,
      color_column: Math.random() * 255,
    }));

export const getRegressionLine = (data2d) =>
  linearRegressionLine(
    linearRegression(data2d.map((d) => [d["x_column"], d["y_column"]]))
  );

export const getHistogramData = (data, binNum = 20) => {
  const bin = d3.bin().thresholds(binNum);
  const binned = bin(data.map((f) => f.x_column)).map((f) => ({
    count: f.length,
    x0: f.x0,
    x1: f.x1,
  }));
  const min = Math.min(...binned.map((f) => f.x0));
  const max = Math.max(...binned.map((f) => f.x1));
  return {
    min,
    max,
    binned,
  };
};

export const getCategoricalData = (n) => {
  let returnObj = ["😀", "😂", "🥰", "😎"].map((f) => ({ label: f, count: 0 }));
  for (let i = 0; i < n; i++) {
    const rand = Math.random();
    if (rand > 0.1) returnObj[0].count++;
    if (rand > 0.5) returnObj[1].count++;
    if (rand > 0.7) returnObj[2].count++;
    if (rand > 0.9) returnObj[3].count++;
  }
  return returnObj;
};

export const getDistributionData = (n) => {
  const seededRandom = getSeededRandom(0.1);
  const randomNormal = getRandomNormal.source(getSeededRandom(0.789))(4, 3);
  return genStats(n, randomNormal, () => 10 * seededRandom());
};
