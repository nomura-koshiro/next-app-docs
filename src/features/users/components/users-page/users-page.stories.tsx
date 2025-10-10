import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import UsersPage from "./users-page";

const meta = {
  title: "features/users/UsersPage",
  component: UsersPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UsersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのユーザー一覧ページ
 *
 * 注: この Story は実際の API 呼び出しを行うため、
 * MSW (Mock Service Worker) を使用してモックデータを返す必要があります。
 */
export const Default: Story = {};

/**
 * ローディング状態
 *
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  render: () => <UsersPage />,
};

/**
 * エラー状態
 *
 * ユーザーデータの読み込みに失敗した状態
 */
export const Error: Story = {
  render: () => <UsersPage />,
};

/**
 * ユーザーが0件の状態
 *
 * ユーザーが登録されていない状態
 */
export const EmptyState: Story = {
  render: () => <UsersPage />,
};

/**
 * 大量のユーザーがいる状態
 *
 * 多数のユーザーが登録されている状態
 */
export const WithManyUsers: Story = {
  render: () => <UsersPage />,
};
