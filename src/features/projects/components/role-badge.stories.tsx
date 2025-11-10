import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RoleBadge } from "./role-badge";

const meta = {
  title: "features/projects/components/RoleBadge",
  component: RoleBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RoleBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * プロジェクトマネージャーバッジ
 */
export const ProjectManager: Story = {
  args: {
    role: "project_manager",
  },
};

/**
 * 権限管理者バッジ
 */
export const ProjectModerator: Story = {
  args: {
    role: "project_moderator",
  },
};

/**
 * メンバーバッジ
 */
export const Member: Story = {
  args: {
    role: "member",
  },
};

/**
 * 閲覧者バッジ
 */
export const Viewer: Story = {
  args: {
    role: "viewer",
  },
};

/**
 * 全ロールの一覧表示
 */
export const AllRoles: Story = {
  args: {
    role: "project_manager", // Dummy value for type satisfaction
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-40">プロジェクトマネージャー:</span>
        <RoleBadge role="project_manager" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">権限管理者:</span>
        <RoleBadge role="project_moderator" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">メンバー:</span>
        <RoleBadge role="member" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">閲覧者:</span>
        <RoleBadge role="viewer" />
      </div>
    </div>
  ),
};
