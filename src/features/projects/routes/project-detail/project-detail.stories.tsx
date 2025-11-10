import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import { delay, http, HttpResponse } from "msw";

import ProjectDetail from "./project-detail";

/**
 * ProjectDetailコンポーネントのストーリー
 *
 * プロジェクト詳細ページコンポーネント。
 * プロジェクトの詳細情報を表示し、編集・削除・メンバー管理への遷移を提供します。
 *
 * @example
 * ```tsx
 * <ProjectDetail projectId="1" />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/projects/routes/project-detail/ProjectDetail",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ProjectDetail,

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
          "プロジェクトの詳細情報を表示するページコンポーネント。データの読み込み、編集・削除・メンバー管理への遷移が実装されています。\n\n" +
          "**主な機能:**\n" +
          "- プロジェクトデータの読み込み\n" +
          "- プロジェクト情報の表示\n" +
          "- 編集・削除・メンバー管理ボタン\n" +
          "- 削除確認ダイアログ\n" +
          "- ローディング状態の表示\n" +
          "- エラーハンドリング\n" +
          "- MSWによるAPIモック\n\n" +
          "**使用場面:**\n" +
          "- プロジェクト管理画面\n" +
          "- プロジェクト詳細の確認",
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * プロジェクト詳細ページの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/projects/1",
        segments: [["id", "1"]],
      },
    },
    docs: {
      description: {
        story: "プロジェクト詳細ページの初期状態。プロジェクトデータが正常に読み込まれ、詳細情報が表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:id", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
              created_by: "user-1",
            },
          });
        }),
      ],
    },
  },
};

/**
 * ローディング状態
 * プロジェクトデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/projects/1",
        segments: [["id", "1"]],
      },
    },
    docs: {
      description: {
        story: "プロジェクトデータの読み込み中の状態。ローディングスピナーが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:id", async () => {
          await delay(5000); // 長い遅延でローディング状態を確認

          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
              created_by: "user-1",
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
 * プロジェクトデータの読み込みに失敗した状態
 */
export const WithError: Story = {
  name: "エラー",
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/projects/999",
        segments: [["id", "999"]],
      },
    },
    docs: {
      description: {
        story: "プロジェクトデータの読み込みに失敗した場合の状態。存在しないIDを指定するとエラーメッセージが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:id", () => {
          return HttpResponse.json({ message: "Project not found" }, { status: 404 });
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

/**
 * 非アクティブなプロジェクト
 * is_activeがfalseのプロジェクト
 */
export const InactiveProject: Story = {
  name: "非アクティブなプロジェクト",
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/projects/2",
        segments: [["id", "2"]],
      },
    },
    docs: {
      description: {
        story: "非アクティブなプロジェクトの詳細。is_activeフラグがfalseの場合の表示。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/:id", () => {
          return HttpResponse.json({
            data: {
              id: "2",
              name: "非アクティブプロジェクト",
              description: "このプロジェクトは非アクティブです",
              is_active: false,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-10T00:00:00Z",
              created_by: "user-1",
            },
          });
        }),
      ],
    },
  },
};
