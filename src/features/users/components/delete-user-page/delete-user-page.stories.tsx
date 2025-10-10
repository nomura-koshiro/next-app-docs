import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DeleteUserPage from "./delete-user-page";

const meta = {
  title: "features/users/DeleteUserPage",
  component: DeleteUserPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DeleteUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの削除確認ページ
 *
 * 注: この Story は実際の API 呼び出しを行うため、
 * MSW (Mock Service Worker) を使用してモックデータを返す必要があります。
 */
export const Default: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
};

/**
 * ローディング状態
 *
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  args: {
    params: Promise.resolve({ id: "loading" }),
  },
};

/**
 * エラー状態
 *
 * ユーザーデータの読み込みに失敗した状態
 */
export const Error: Story = {
  args: {
    params: Promise.resolve({ id: "error" }),
  },
};
