import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import EditUserPage from "./edit-user-page";

const meta = {
  title: "features/users/EditUserPage",
  component: EditUserPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EditUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのユーザー編集ページ
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

/**
 * フォーム入力済み状態
 *
 * ユーザーデータが読み込まれ、フォームに表示されている状態
 */
export const WithData: Story = {
  args: {
    params: Promise.resolve({ id: "1" }),
  },
};
