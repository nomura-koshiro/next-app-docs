import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import { delay, http, HttpResponse } from "msw";

import UsersPage from "./users";

/**
 * UsersPageコンポーネントのストーリー
 *
 * ユーザー一覧ページコンポーネント。
 * 登録されているユーザーの一覧を表示し、編集・削除・新規作成の操作を提供します。
 *
 * @example
 * ```tsx
 * <UsersPage />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/sample-users/routes/sample-users/Users",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: UsersPage,

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
          "ユーザー一覧を表示するためのページコンポーネント。データの読み込み、一覧表示、各種操作が実装されています。\n\n" +
          "**主な機能:**\n" +
          "- ユーザーデータの一覧表示\n" +
          "- 編集・削除操作\n" +
          "- 新規ユーザー作成\n" +
          "- ローディング状態の表示\n" +
          "- エラーハンドリング\n" +
          "- 空状態の表示\n" +
          "- MSWによるAPIモック\n\n" +
          "**使用場面:**\n" +
          "- ユーザー管理画面\n" +
          "- 管理者ダッシュボード",
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],
} satisfies Meta<typeof UsersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ユーザー一覧ページの通常状態
 */
export const UsersList: Story = {
  name: "ユーザー一覧表示",
  parameters: {
    docs: {
      description: {
        story: "ユーザー一覧ページの初期状態。ユーザーデータが正常に読み込まれ、テーブル形式で表示されます。",
      },
    },
  },
  // FIXME: @storybook/test v9安定版リリース待ち
  // Vitest環境でデータ表示が正常に動作しない問題
  // 関連: Storybook 9 + React 19 + Vitest browser mode
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const userName = await canvas.findByText("John Doe");
    expect(userName).toBeInTheDocument();

    const userEmail = await canvas.findByText("john@example.com");
    expect(userEmail).toBeInTheDocument();

    expect(canvas.getByText("ID")).toBeInTheDocument();
    expect(canvas.getByText("名前")).toBeInTheDocument();
    expect(canvas.getByText("メールアドレス")).toBeInTheDocument();
    expect(canvas.getByText("ロール")).toBeInTheDocument();
  },
  tags: ["skip"],
};

/**
 * ローディング状態
 * ユーザーデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    docs: {
      description: {
        story: "ユーザーデータの読み込み中の状態。ローディングスピナーが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/sample/users", async () => {
          await delay(5000);

          return HttpResponse.json({
            data: [
              {
                id: "1",
                name: "John Doe",
                email: "john@example.com",
                role: "user",
                createdAt: "2024-01-01",
              },
            ],
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loadingElement = canvas.getByTestId("loading-spinner");
    expect(loadingElement).toBeInTheDocument();
  },
};

/**
 * エラー状態
 * API エラーが発生した際の表示
 */
export const WithError: Story = {
  name: "エラー",
  parameters: {
    docs: {
      description: {
        story: "APIエラーが発生した場合の状態。ErrorBoundaryによりエラーメッセージが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/sample/users", () => {
          return HttpResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }),
      ],
    },
  },
  // FIXME: @storybook/test v9安定版リリース待ち
  // Vitest環境でErrorBoundaryが正常に動作しない問題
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ErrorBoundaryによるエラーメッセージが表示されることを確認
    const errorMessage = await canvas.findByText(/予期しないエラーが発生しました/i);
    expect(errorMessage).toBeInTheDocument();
  },
  tags: ["skip"],
};

/**
 * 空の状態
 * ユーザーが存在しない場合の表示
 */
export const EmptyState: Story = {
  name: "空の状態",
  parameters: {
    docs: {
      description: {
        story: "ユーザーが1件も登録されていない場合の表示。空状態メッセージが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/sample/users", () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
  // FIXME: @storybook/test v9安定版リリース待ち
  // Vitest環境で空状態メッセージが正常に表示されない問題
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emptyMessage = await canvas.findByText(/ユーザーが見つかりません/i);
    expect(emptyMessage).toBeInTheDocument();
  },
  tags: ["skip"],
};

/**
 * 多数のユーザー
 * 多数のユーザーが存在する場合の表示
 */
export const ManyUsers: Story = {
  name: "多数のユーザー",
  parameters: {
    docs: {
      description: {
        story: "多数のユーザーが登録されている場合の表示例。スクロールやレイアウトの確認に使用します。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/sample/users", () => {
          const users = Array.from({ length: 20 }, (_, i) => ({
            id: String(i + 1),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: i % 3 === 0 ? "admin" : "user",
            createdAt: "2024-01-01",
          }));

          return HttpResponse.json({ data: users });
        }),
      ],
    },
  },
  // FIXME: @storybook/test v9安定版リリース待ち
  // Vitest環境でデータ表示が正常に動作しない問題
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("User 1");

    const userNames = canvas.getAllByText(/User \d+/);
    expect(userNames.length).toBeGreaterThan(10);
  },
  tags: ["skip"],
};
