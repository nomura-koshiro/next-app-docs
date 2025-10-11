import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { DeleteUserConfirmation } from "./delete-user-confirmation";
import type { User } from "@/features/users/types";

const meta = {
  title: "features/users/routes/delete-user/components/DeleteUserConfirmation",
  component: DeleteUserConfirmation,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onDelete: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DeleteUserConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser: User = {
  id: "1",
  name: "山田太郎",
  email: "yamada@example.com",
  role: "user",
  createdAt: "2024-01-15",
};

const mockAdminUser: User = {
  id: "2",
  name: "佐藤花子",
  email: "sato@example.com",
  role: "admin",
  createdAt: "2024-02-20",
};

/**
 * デフォルト状態
 * ユーザー削除確認の通常状態（一般ユーザー）
 */
export const Default: Story = {
  args: {
    user: mockUser,
    isDeleting: false,
    deleteError: null,
  },
};

/**
 * 管理者ユーザーの削除
 * 管理者ユーザーを削除する場合の表示
 */
export const AdminUser: Story = {
  args: {
    user: mockAdminUser,
    isDeleting: false,
    deleteError: null,
  },
};

/**
 * 削除中状態
 * ユーザー削除処理中でボタンが無効化されている状態
 */
export const Deleting: Story = {
  args: {
    user: mockUser,
    isDeleting: true,
    deleteError: null,
  },
};

/**
 * 削除エラー状態
 * ユーザー削除に失敗してエラーメッセージが表示されている状態
 */
export const WithDeleteError: Story = {
  args: {
    user: mockUser,
    isDeleting: false,
    deleteError: "ユーザーの削除に失敗しました",
  },
};

/**
 * 削除エラー状態（管理者）
 * 管理者ユーザーの削除に失敗した状態
 */
export const AdminUserWithError: Story = {
  args: {
    user: mockAdminUser,
    isDeleting: false,
    deleteError: "ユーザーの削除に失敗しました",
  },
};

/**
 * 長い名前・メールアドレス
 * 情報表示のレイアウト確認用
 */
export const LongContent: Story = {
  args: {
    user: {
      id: "3",
      name: "非常に長いユーザー名前田中一郎太郎次郎三郎四郎五郎",
      email: "very.long.email.address.for.testing@example.company.co.jp",
      role: "user",
      createdAt: "2024-03-10",
    },
    isDeleting: false,
    deleteError: null,
  },
};
