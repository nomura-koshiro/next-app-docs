import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "@storybook/test";
import { delay, http, HttpResponse } from "msw";

import ProjectsList from "./projects-list";

/**
 * ProjectsListコンポーネントのストーリー
 *
 * プロジェクト一覧ページコンポーネント。
 * 登録されているプロジェクトの一覧を表示し、編集・削除・新規作成の操作を提供します。
 *
 * @example
 * ```tsx
 * <ProjectsList />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/projects/routes/projects-list/ProjectsList",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ProjectsList,

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
          "プロジェクト一覧を表示するためのページコンポーネント。データの読み込み、一覧表示、各種操作が実装されています。\n\n" +
          "**主な機能:**\n" +
          "- プロジェクトデータの一覧表示\n" +
          "- 詳細表示・編集・削除操作\n" +
          "- 新規プロジェクト作成\n" +
          "- ローディング状態の表示\n" +
          "- エラーハンドリング\n" +
          "- 空状態の表示\n" +
          "- MSWによるAPIモック\n\n" +
          "**使用場面:**\n" +
          "- プロジェクト管理画面\n" +
          "- プロジェクト一覧ダッシュボード",
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectsList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * プロジェクト一覧ページの通常状態
 */
export const Default: Story = {
  name: "プロジェクト一覧表示",
  parameters: {
    docs: {
      description: {
        story: "プロジェクト一覧ページの初期状態。プロジェクトデータが正常に読み込まれ、テーブル形式で表示されます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // デフォルトのMSWハンドラーからプロジェクトデータが表示されることを確認
    // 複数の要素が見つかる可能性があるため、getAllByTextを使用
    const projectElements = await canvas.findAllByText(/サンプルプロジェクト/i);
    expect(projectElements.length).toBeGreaterThan(0);
  },
};

/**
 * ローディング状態
 * プロジェクトデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    docs: {
      description: {
        story: "プロジェクトデータの読み込み中の状態。ローディングスピナーが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects", async () => {
          await delay(5000); // 長い遅延でローディング状態を確認

          return HttpResponse.json({
            data: [
              {
                id: "1",
                name: "サンプルプロジェクト",
                description: "プロジェクトの説明",
                is_active: true,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: "user-1",
              },
            ],
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
        http.get("*/api/v1/projects", () => {
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
 * プロジェクトが存在しない場合の表示
 */
export const EmptyState: Story = {
  name: "空の状態",
  parameters: {
    docs: {
      description: {
        story: "プロジェクトが1件も登録されていない場合の表示。空状態メッセージが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects", () => {
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
  // FIXME: @storybook/test v9安定版リリース待ち
  // Vitest環境で空状態メッセージが正常に表示されない問題
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 空状態メッセージが表示されることを確認
    const emptyMessage = await canvas.findByText(/プロジェクトが見つかりません/i);
    expect(emptyMessage).toBeInTheDocument();
  },
  tags: ["skip"],
};

/**
 * 多数のプロジェクト
 * 多数のプロジェクトが存在する場合の表示
 */
export const ManyProjects: Story = {
  name: "多数のプロジェクト",
  parameters: {
    docs: {
      description: {
        story: "多数のプロジェクトが登録されている場合の表示例。スクロールやレイアウトの確認に使用します。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects", () => {
          const projects = Array.from({ length: 20 }, (_, i) => ({
            id: String(i + 1),
            name: `プロジェクト ${i + 1}`,
            description: `プロジェクト ${i + 1} の説明`,
            is_active: i % 3 !== 0, // 3件に1件は非アクティブ
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            created_by: "user-1",
          }));

          return HttpResponse.json({ data: projects });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 最初のプロジェクトが表示されることを確認
    await canvas.findByText("プロジェクト 1");

    // 複数のプロジェクトが表示されていることを確認
    const projectNames = canvas.getAllByText(/プロジェクト \d+/);
    expect(projectNames.length).toBeGreaterThan(10);
  },
};

/**
 * アクティブ・非アクティブ混在
 * アクティブと非アクティブのプロジェクトが混在する状態
 */
export const MixedActiveState: Story = {
  name: "アクティブ・非アクティブ混在",
  parameters: {
    docs: {
      description: {
        story: "アクティブなプロジェクトと非アクティブなプロジェクトが混在している場合の表示。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects", () => {
          return HttpResponse.json({
            data: [
              {
                id: "1",
                name: "アクティブプロジェクト1",
                description: "アクティブなプロジェクト",
                is_active: true,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: "user-1",
              },
              {
                id: "2",
                name: "非アクティブプロジェクト",
                description: "非アクティブなプロジェクト",
                is_active: false,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-02T00:00:00Z",
                created_by: "user-1",
              },
              {
                id: "3",
                name: "アクティブプロジェクト2",
                description: "アクティブなプロジェクト",
                is_active: true,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-03T00:00:00Z",
                created_by: "user-2",
              },
            ],
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // アクティブ・非アクティブ両方のプロジェクトが表示されることを確認
    const activeProject = await canvas.findByText("アクティブプロジェクト1");
    expect(activeProject).toBeInTheDocument();

    const inactiveProject = await canvas.findByText("非アクティブプロジェクト");
    expect(inactiveProject).toBeInTheDocument();
  },
};
