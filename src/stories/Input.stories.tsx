import type { Meta, StoryObj } from "@storybook/react";

import Input from "../components/Input";

const meta = {
  title: "Example/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { description: "Seconds" },
  decorators: [
    (Story) => (
      <div className="flex h-[667px] w-[375px] flex-col justify-center bg-black p-10 text-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleButton: Story = {
  args: {},
};
