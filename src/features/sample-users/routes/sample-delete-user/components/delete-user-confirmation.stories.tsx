import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { DeleteUserConfirmation } from "./delete-user-confirmation";
import type { User } from "@/features/sample-users/types";

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

/**
 * デフォルト状態
 * ユーザー削除確認の通常状態（一般ユーザー）
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    user: mockUser,
    isDeleting: false,
    deleteError: null,
  },
};

/**
 * 削除中状態
 * ユーザー削除処理中でボタンが無効化されている状態
 */
export const Deleting: Story = {
  name: "削除中",
  args: {
    user: mockUser,
    isDeleting: true,
    deleteError: null,
  },
};

/**
 * エラー状態
 * ユーザー削除に失敗してエラーメッセージが表示されている状態
 */
export const WithError: Story = {
  name: "エラー",
  args: {
    user: mockUser,
    isDeleting: false,
    deleteError: "ユーザーの削除に失敗しました",
  },
};
