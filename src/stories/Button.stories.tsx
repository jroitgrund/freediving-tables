import type { Meta, StoryObj } from "@storybook/react";

import Button from "../components/Button";
import StoriesContainer from "./StoriesContainer";

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
      <StoriesContainer>
        <div className="flex grow items-center">
          <Story />
        </div>
      </StoriesContainer>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleButton: Story = {
  args: {},
};
