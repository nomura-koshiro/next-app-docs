import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProjectMembers } from "./project-members";

const meta = {
  title: "Features/Projects/Routes/ProjectMembers/ProjectMembers",
  component: ProjectMembers,
  parameters: {
    layout: "padded",
    msw: {
      handlers: [],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectMembers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 *
 * MSWハンドラーがモックデータを提供します。
 */
export const Default: Story = {
  args: {
    projectId: "project-1",
  },
};

/**
 * 別のプロジェクト
 */
export const AnotherProject: Story = {
  args: {
    projectId: "project-2",
  },
};
