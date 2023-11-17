import type { Meta, StoryObj } from "@storybook/react";

import OneBreath from "../components/OneBreath";

const meta = {
  title: "Example/OneBreath",
  component: OneBreath,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    kill: () => {},
    tap: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex h-[667px] w-[375px] flex-col bg-black text-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OneBreath>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TapToStart: Story = {
  args: {
    viewModel: { status: "tap-to-start" },
  },
};

export const Holding: Story = {
  args: {
    viewModel: {
      status: "holding",
      secondsHeld: 20,
      tablesDone: 5,
    },
  },
};

export const BreathingUp: Story = {
  args: {
    viewModel: { status: "breathing-up", secondsLeft: 2, tablesDone: 4 },
  },
};

export const Done: Story = {
  args: {
    viewModel: { status: "done" },
  },
};
