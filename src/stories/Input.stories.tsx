import type { Meta, StoryObj } from "@storybook/react";

import Input from "../components/Input";
import StoriesContainer from "./StoriesContainer";

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
      <StoriesContainer>
        <div className="flex grow items-center">
          <Story />
        </div>
      </StoriesContainer>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleButton: Story = {
  args: {},
};
