import React from "react";
import { Story, Meta } from "@storybook/react";
//@ts-ignore
const TestComponent: React.FC = (props) => <div>{props.test}</div>

export default {
  title: "Matico/Test",
  component: TestComponent,
  argTypes: {},
} as Meta<typeof TestComponent>;

const Template: Story<any> = (args) => <TestComponent {...args} />;

export const Test = Template.bind({});
Test.args = {
    test: 'test test test'
}