import React from "react";
import { Story, Meta } from "@storybook/react";
import { MaticoChart } from '..'
import { ChartComposition } from "../Types/Composition";
import { MaticoChartProps } from "../Components/MaticoChart";
export default {
  title: "Matico/Charts",
  component: MaticoChart,
  argTypes: {
    onClick: { action: "clicked" },
  },
} as Meta<typeof MaticoChart>;


const Template: Story<MaticoChartProps> = (args) => (
  <MaticoChart {...args} />
);

const data1 = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 },
]

const data2 = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 3}
]

const LineChartArgs: MaticoChartProps = {
  height: 500,
  spec: {
    data: data1,
    charts: [
      {
        spec: {
          labels: [],
          data: data1,   
          layers: [
            {
              type: "line",
              data: data2              
            }
          ]
        },
        width: 50,
        height: 50,
      },
      {
        spec: {
          data: data1,
          labels: [],
          layers: []
        },
        width: 50,
        height: 50,
        position: {
          left: 50,
          top: 0
        }
      },
      {
        spec: {
          data: data1,
          labels: [],
          layers: []
        },
        width: 50,
        height: 50,
        position: {
          left: 50,
          top: 0
        }
      },
      {
        spec: {
          data: data2,
          labels: [],
          layers: []
        },
        width: 50,
        height: 50,
      },
    ]
  }
}

export const LineChart = Template.bind({});
LineChart.args = LineChartArgs