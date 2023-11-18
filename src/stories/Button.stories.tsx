import type { Meta, StoryObj } from "@storybook/react";

import Button from "../components/Button";

const meta = {
  title: "Example/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { children: <>Click me!</> },
  decorators: [
    (Story) => (
      <div className="flex h-[667px] w-[375px] flex-col justify-center bg-black p-2 text-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleButton: Story = {
  args: {},
};
