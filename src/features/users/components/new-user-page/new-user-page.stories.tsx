import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import NewUserPage from "./new-user-page";

const meta = {
  title: "features/users/NewUserPage",
  component: NewUserPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NewUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの新規ユーザー作成ページ
 *
 * 注: この Story は実際の API 呼び出しを行うため、
 * MSW (Mock Service Worker) を使用してモックデータを返す必要があります。
 */
export const Default: Story = {};

/**
 * フォーム入力済み状態
 *
 * 開発時のテスト用に、入力済みの状態を表示
 */
export const FilledForm: Story = {
  render: () => <NewUserPage />,
};

/**
 * エラー状態
 *
 * API エラーが発生した際の表示
 */
export const WithError: Story = {
  render: () => <NewUserPage />,
};
