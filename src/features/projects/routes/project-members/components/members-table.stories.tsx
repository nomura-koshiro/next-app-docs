import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { type ProjectMember, ProjectRole, SystemRole } from "../../../types";
import { MembersTable } from "./members-table";

const mockMembers: ProjectMember[] = [
  {
    id: "member-1",
    project_id: "project-1",
    user_id: "user-1",
    role: ProjectRole.PROJECT_MANAGER,
    joined_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      id: "user-1",
      azure_oid: "azure-oid-1",
      email: "manager@example.com",
      display_name: "田中 太郎",
      roles: [SystemRole.USER],
      is_active: true,
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
      last_login: "2024-10-01T10:00:00Z",
    },
  },
  {
    id: "member-2",
    project_id: "project-1",
    user_id: "user-2",
    role: ProjectRole.PROJECT_MODERATOR,
    joined_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    user: {
      id: "user-2",
      azure_oid: "azure-oid-2",
      email: "moderator@example.com",
      display_name: "鈴木 花子",
      roles: [SystemRole.USER],
      is_active: true,
      created_at: "2024-02-01T00:00:00Z",
      updated_at: "2024-02-01T00:00:00Z",
      last_login: "2024-10-02T11:00:00Z",
    },
  },
  {
    id: "member-3",
    project_id: "project-1",
    user_id: "user-3",
    role: ProjectRole.MEMBER,
    joined_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    user: {
      id: "user-3",
      azure_oid: "azure-oid-3",
      email: "member@example.com",
      display_name: "佐藤 次郎",
      roles: [SystemRole.USER],
      is_active: true,
      created_at: "2024-03-01T00:00:00Z",
      updated_at: "2024-03-01T00:00:00Z",
      last_login: "2024-10-03T12:00:00Z",
    },
  },
  {
    id: "member-4",
    project_id: "project-1",
    user_id: "user-4",
    role: ProjectRole.VIEWER,
    joined_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
    user: {
      id: "user-4",
      azure_oid: "azure-oid-4",
      email: "viewer@example.com",
      display_name: "高橋 三郎",
      roles: [SystemRole.USER],
      is_active: true,
      created_at: "2024-04-01T00:00:00Z",
      updated_at: "2024-04-01T00:00:00Z",
      last_login: "2024-10-04T13:00:00Z",
    },
  },
];

const meta = {
  title: "Features/Projects/Routes/ProjectMembers/MembersTable",
  component: MembersTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MembersTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  args: {
    members: mockMembers,
    onRoleChange: (memberId: string, role: ProjectRole) => console.log("Role changed:", memberId, role),
    onRemoveMember: (memberId: string) => console.log("Member removed:", memberId),
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    members: [],
    isLoading: true,
  },
};

/**
 * メンバーなし
 */
export const Empty: Story = {
  args: {
    members: [],
    isLoading: false,
  },
};

/**
 * 操作なし（表示のみ）
 */
export const ReadOnly: Story = {
  args: {
    members: mockMembers,
  },
};

/**
 * 1人のみ
 */
export const SingleMember: Story = {
  args: {
    members: [mockMembers[0]],
    onRoleChange: (memberId: string, role: ProjectRole) => console.log("Role changed:", memberId, role),
    onRemoveMember: (memberId: string) => console.log("Member removed:", memberId),
  },
};
