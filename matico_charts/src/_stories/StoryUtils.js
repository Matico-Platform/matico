import { linearRegression, linearRegressionLine } from 'simple-statistics';
import * as d3 from 'd3';
import mapdata from './sample_data/Counties_In_California.json'
import mapdata2 from './sample_data/ILcounty_medinc.json'
import mapdata3 from './sample_data/samplepoint.json'
import mapdata4 from './sample_data/sampleline.json'
import mapdata5 from './sample_data/samplerectangle-c.json'
import mapdata6 from './sample_data/samplelinepolymix.json'

// samplepoly2 has the coordinates drawn counterclockwise and
// samplepoly3 has coordinates drawn clockwise

export const generate2dData = (n) => Array(n)
  .fill(0)
  .map((_, i) => ({
    x_column: Math.random() * (i + 50) * .5,
    y_column: Math.random() * (i + 50) * 2,
    r_column: Math.floor(Math.random() * 10) + 1,
    color_column: Math.random() * 255,
  }));

export const getRegressionLine = (data2d) => linearRegressionLine(
  linearRegression(data2d.map((d) => [d['x_column'], d['y_column']]))
);

export const getHistogramData = (data, binNum=20) => {
  const bin = d3.bin().thresholds(binNum)
  const binned = bin(data.map(f => f.x_column)).map(f => ({count: f.length, x0: f.x0, x1: f.x1}));
  const min = Math.min(...binned.map((f) => f.x0));
  const max = Math.max(...binned.map((f) => f.x1));
  return {
    min,
    max,
    binned
}};

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

export const getMapData = (i) => {
  if (i === 1) {
    // console.log("mapdata:", mapdata);     // California counties
    return mapdata.features;
  } else if (i === 2) {
    // console.log("mapdata2:", mapdata2);   // Illinois counties
    return mapdata2.features;
  } else if (i === 3) {
    // console.log("mapdata3:", mapdata3)    // Geojson with only points
    return mapdata3.features;
  } else if (i === 4) {
    // console.log("mapdata4:", mapdata4)    // Geojson with line strings
    return mapdata4.features;
  } else if (i === 5) {
    // console.log("mapdata5:", mapdata5)    // Geojson with a rectangle (clockwise coordinates work)
    return mapdata5.features;
  } else if (i === 6) {
    // console.log("mapdata6:", mapdata6)
    return mapdata6.features;
  }
}


export const getLineChartData = (n) => {
  let date = new Date('1970-01-01');
  let returnObj = [];
  for (let i = 0; i < n; i++) {
    returnObj.push({
      date: new Date(date),
      value: i + Math.random() * 50,
    });
    date.setDate(date.getDate() + 1);
  }
  return returnObj
}