import type { Meta, StoryObj } from "@storybook/react";

import Relaxation from "../components/Relaxation";

const meta = {
  title: "Example/Relaxation",
  component: Relaxation,
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
      <div className="flex h-[500px] w-[375px] flex-col bg-black text-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Relaxation>;

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
      secondsHeld: 121,
      times: [100, 110, 101, 12341, 3124, 132, 435, 1342, 123, 134, 13, 3],
    },
  },
};

export const BreathingUp: Story = {
  args: {
    viewModel: { status: "breathing-up", secondsLeft: 121, times: [100, 110] },
  },
};

export const Done: Story = {
  args: {
    viewModel: { status: "done", times: [100, 110] },
  },
};
