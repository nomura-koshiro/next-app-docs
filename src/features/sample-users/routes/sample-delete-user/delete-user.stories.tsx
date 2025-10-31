import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import { delay, http, HttpResponse } from "msw";

import DeleteUserPage from "./delete-user";

/**
 * DeleteUserPageコンポーネントのストーリー
 *
 * ユーザー削除ページコンポーネント。
 * ユーザー情報を読み込み、削除の確認を行い、APIに送信します。
 *
 * @example
 * ```tsx
 * <DeleteUserPage params={Promise.resolve({ id: "1" })} />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/sample-users/routes/sample-delete-user/DeleteUser",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: DeleteUserPage,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // ================================================================================
    layout: "fullscreen",

    // ================================================================================
    // Next.js設定
    // ================================================================================
    nextjs: {
      appDirectory: true,
    },

    // ================================================================================
    // コンポーネントの詳細説明
    // ================================================================================
    docs: {
      description: {
        component:
          "ユーザーを削除するためのページコンポーネント。ユーザーデータの読み込み、削除確認、削除処理が実装されています。\n\n" +
          "**主な機能:**\n" +
          "- ユーザーデータの読み込み\n" +
          "- 削除対象ユーザーの情報表示\n" +
          "- 削除確認ダイアログ\n" +
          "- API連携による削除\n" +
          "- ローディング状態の表示\n" +
          "- エラーハンドリング\n" +
          "- MSWによるAPIモック\n\n" +
          "**使用場面:**\n" +
          "- ユーザー管理画面\n" +
          "- ユーザーの削除",
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],
} satisfies Meta<typeof DeleteUserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ユーザー削除確認ページの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    docs: {
      description: {
        story: "ユーザー削除確認ページの初期状態。削除対象のユーザー情報が表示され、削除の確認を求めます。",
      },
    },
  },
};

/**
 * ローディング状態
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  args: {
    params: Promise.resolve({ id: "1" }),
  },
  parameters: {
    docs: {
      description: {
        story: "ユーザーデータの読み込み中の状態。ローディングスピナーが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/sample/users/:id", async () => {
          await delay(5000); // 長い遅延でローディング状態を確認

          return HttpResponse.json({
            data: {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ローディングスピナーが表示されることを確認
    const loadingElement = canvas.getByTestId("loading-spinner");
    expect(loadingElement).toBeInTheDocument();
  },
};

/**
 * エラー状態
 * ユーザーデータの読み込みに失敗した状態
 */
export const WithError: Story = {
  name: "エラー",
  args: {
    params: Promise.resolve({ id: "999" }),
  },
  parameters: {
    docs: {
      description: {
        story: "ユーザーデータの読み込みに失敗した場合の状態。存在しないIDを指定するとエラーメッセージが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/sample/users/:id", () => {
          return HttpResponse.json({ message: "User not found" }, { status: 404 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ErrorBoundaryによるエラーメッセージが表示されることを確認
    const errorMessage = await canvas.findByText(/予期しないエラーが発生しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
};
