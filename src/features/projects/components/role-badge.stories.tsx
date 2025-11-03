import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProjectRole } from "../types";
import { RoleBadge } from "./role-badge";

const meta = {
  title: "Features/Projects/Components/RoleBadge",
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
    role: ProjectRole.PROJECT_MANAGER,
  },
};

/**
 * 権限管理者バッジ
 */
export const ProjectModerator: Story = {
  args: {
    role: ProjectRole.PROJECT_MODERATOR,
  },
};

/**
 * メンバーバッジ
 */
export const Member: Story = {
  args: {
    role: ProjectRole.MEMBER,
  },
};

/**
 * 閲覧者バッジ
 */
export const Viewer: Story = {
  args: {
    role: ProjectRole.VIEWER,
  },
};

/**
 * 全ロールの一覧表示
 */
export const AllRoles: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-40">プロジェクトマネージャー:</span>
        <RoleBadge role={ProjectRole.PROJECT_MANAGER} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">権限管理者:</span>
        <RoleBadge role={ProjectRole.PROJECT_MODERATOR} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">メンバー:</span>
        <RoleBadge role={ProjectRole.MEMBER} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">閲覧者:</span>
        <RoleBadge role={ProjectRole.VIEWER} />
      </div>
    </div>
  ),
};
