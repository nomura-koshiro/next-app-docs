import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PROJECT_ROLES } from "../types";
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
    role: PROJECT_ROLES.PROJECT_MANAGER,
  },
};

/**
 * 権限管理者バッジ
 */
export const ProjectModerator: Story = {
  args: {
    role: PROJECT_ROLES.PROJECT_MODERATOR,
  },
};

/**
 * メンバーバッジ
 */
export const Member: Story = {
  args: {
    role: PROJECT_ROLES.MEMBER,
  },
};

/**
 * 閲覧者バッジ
 */
export const Viewer: Story = {
  args: {
    role: PROJECT_ROLES.VIEWER,
  },
};

/**
 * 全ロールの一覧表示
 */
export const AllRoles: Story = {
  args: {
    role: PROJECT_ROLES.PROJECT_MANAGER,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-40">プロジェクトマネージャー:</span>
        <RoleBadge role={PROJECT_ROLES.PROJECT_MANAGER} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">権限管理者:</span>
        <RoleBadge role={PROJECT_ROLES.PROJECT_MODERATOR} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">メンバー:</span>
        <RoleBadge role={PROJECT_ROLES.MEMBER} />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-40">閲覧者:</span>
        <RoleBadge role={PROJECT_ROLES.VIEWER} />
      </div>
    </div>
  ),
};
