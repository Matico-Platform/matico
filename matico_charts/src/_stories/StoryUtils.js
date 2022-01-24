import { linearRegression, linearRegressionLine } from 'simple-statistics';

export const generate2dData = (n) => Array(n)
  .fill(0)
  .map((_, i) => ({
    x_column: Math.random() * Math.sqrt(i),
    y_column: Math.random() * (i + 50) * 2,
    r_column: Math.floor(Math.random() * 10) + 1,
    color_column: Math.random() * 255,
  }));

export const getRegressionLine = (data2d) => linearRegressionLine(
  linearRegression(data2d.map((d) => [d['x_column'], d['y_column']]))
);

export const getHistogramData = (data) => {
  const min = Math.min(...data.map((f) => f.x_column));
  const max = Math.max(...data.map((f) => f.x_column));
  const binNum = 20;
  const step = (max - min) / binNum;
  let counts = {};
  let steps = [];
  let iter = min + step;

  do {
    iter += step;
    steps.unshift(iter);
    counts[iter] = 0;
  } while (iter <= max);

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < steps.length; j++) {
      if (data[i]['x_column'] > steps[j]) {
        counts[steps[j]] += 1;
        break;
      }
    }
  }

  return {
    min,
    max,
    step,
    steps,
    data: Array(steps.length)
      .fill(null)
      .map((_, idx) => ({
        min: steps[idx - 1],
        max: steps[idx],
        count: counts[steps[idx]],
      })),
  };
};

export const getCategoricalData = (n) => {
  let returnObj = ['😀', '😂', '🥰', '😎'].map((f) => ({ label: f, count: 0 }));
  for (let i = 0; i < n; i++) {
    const rand = Math.random();
    if (rand > 0.1) returnObj[0].count++;
    if (rand > 0.5) returnObj[1].count++;
    if (rand > 0.7) returnObj[2].count++;
    if (rand > 0.9) returnObj[3].count++;
  }
  return returnObj;
};


