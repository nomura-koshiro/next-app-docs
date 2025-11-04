import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { delay, http, HttpResponse } from "msw";

import ProjectMembers from "./project-members";

/**
 * ProjectMembersコンポーネントのストーリー
 *
 * プロジェクトメンバー管理ページコンポーネント。
 * プロジェクトメンバーの一覧表示、ロール変更、削除、追加を提供します。
 *
 * @example
 * ```tsx
 * <ProjectMembers />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/projects/routes/project-members/ProjectMembers",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ProjectMembers,

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
      navigation: {
        pathname: "/projects/1/members",
        params: { id: "1" },
      },
    },

    // ================================================================================
    // コンポーネントの詳細説明
    // ================================================================================
    docs: {
      description: {
        component:
          "プロジェクトメンバーを管理するページコンポーネント。メンバーの一覧表示、追加、ロール変更、削除が実装されています。\n\n" +
          "**主な機能:**\n" +
          "- メンバー一覧の表示\n" +
          "- メンバーの追加（ダイアログ）\n" +
          "- ロールの変更（project_manager, project_moderator, member, viewer）\n" +
          "- メンバーの削除\n" +
          "- ローディング状態の表示\n" +
          "- エラーハンドリング\n" +
          "- MSWによるAPIモック\n\n" +
          "**使用場面:**\n" +
          "- プロジェクト管理画面\n" +
          "- メンバー権限の管理",
      },
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectMembers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * プロジェクトメンバー管理ページの通常状態
 */
export const Default: Story = {
  name: "デフォルト",
  parameters: {
    docs: {
      description: {
        story: "プロジェクトメンバー管理ページの初期状態。メンバー一覧が正常に読み込まれ、表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/1", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          });
        }),
        http.get("*/api/v1/projects/1/members", () => {
          return HttpResponse.json({
            data: [
              {
                id: "1",
                project_id: "1",
                user_id: "user-1",
                role: "project_manager",
                joined_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                user: {
                  id: "user-1",
                  azure_oid: "azure-1",
                  email: "manager@example.com",
                  display_name: "プロジェクトマネージャー",
                  roles: ["user"],
                  is_active: true,
                  created_at: "2024-01-01T00:00:00Z",
                  updated_at: "2024-01-01T00:00:00Z",
                  last_login: "2024-01-01T00:00:00Z",
                },
              },
              {
                id: "2",
                project_id: "1",
                user_id: "user-2",
                role: "member",
                joined_at: "2024-01-02T00:00:00Z",
                updated_at: "2024-01-02T00:00:00Z",
                user: {
                  id: "user-2",
                  azure_oid: "azure-2",
                  email: "member@example.com",
                  display_name: "メンバー",
                  roles: ["user"],
                  is_active: true,
                  created_at: "2024-01-01T00:00:00Z",
                  updated_at: "2024-01-01T00:00:00Z",
                  last_login: "2024-01-02T00:00:00Z",
                },
              },
            ],
          });
        }),
      ],
    },
  },
};

/**
 * ローディング状態
 * メンバーデータを読み込み中の状態
 */
export const Loading: Story = {
  name: "ローディング中",
  parameters: {
    docs: {
      description: {
        story: "メンバーデータの読み込み中の状態。ローディングスピナーが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/1", async () => {
          await delay(5000);

          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          });
        }),
        http.get("*/api/v1/projects/1/members", async () => {
          await delay(5000); // 長い遅延でローディング状態を確認

          return HttpResponse.json({
            data: [],
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
 * メンバーデータの読み込みに失敗した状態
 */
export const WithError: Story = {
  name: "エラー",
  parameters: {
    docs: {
      description: {
        story: "メンバーデータの読み込みに失敗した場合の状態。存在しないプロジェクトIDを指定するとエラーメッセージが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/1", () => {
          return HttpResponse.json({ message: "Project not found" }, { status: 404 });
        }),
        http.get("*/api/v1/projects/1/members", () => {
          return HttpResponse.json({ message: "Project not found" }, { status: 404 });
        }),
      ],
    },
  },
};

/**
 * メンバーなし状態
 * プロジェクトにメンバーがいない状態
 */
export const NoMembers: Story = {
  name: "メンバーなし",
  parameters: {
    docs: {
      description: {
        story: "プロジェクトにメンバーがいない場合の状態。メンバーを追加するボタンが表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/1", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          });
        }),
        http.get("*/api/v1/projects/1/members", () => {
          return HttpResponse.json({
            data: [],
          });
        }),
      ],
    },
  },
};

/**
 * 多数のメンバー
 * プロジェクトに多数のメンバーがいる状態
 */
export const ManyMembers: Story = {
  name: "多数のメンバー",
  parameters: {
    docs: {
      description: {
        story: "プロジェクトに多数のメンバーがいる場合の状態。スクロール可能な一覧が表示されます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/1", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          });
        }),
        http.get("*/api/v1/projects/1/members", () => {
          const members = Array.from({ length: 20 }, (_, i) => ({
            id: `member-${i + 1}`,
            project_id: "1",
            user_id: `user-${i + 1}`,
            role: ["project_manager", "project_moderator", "member", "viewer"][i % 4] as
              | "project_manager"
              | "project_moderator"
              | "member"
              | "viewer",
            joined_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            user: {
              id: `user-${i + 1}`,
              azure_oid: `azure-${i + 1}`,
              email: `user${i + 1}@example.com`,
              display_name: `ユーザー ${i + 1}`,
              roles: ["user"] as const,
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
              last_login: "2024-01-01T00:00:00Z",
            },
          }));

          return HttpResponse.json({
            data: members,
          });
        }),
      ],
    },
  },
};

/**
 * メンバー追加ダイアログ表示
 * メンバー追加ダイアログが開いている状態
 */
export const AddMemberDialogOpen: Story = {
  name: "メンバー追加ダイアログ",
  parameters: {
    docs: {
      description: {
        story: "メンバー追加ダイアログが開いている状態。ユーザーIDとロールを入力してメンバーを追加できます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/api/v1/projects/1", () => {
          return HttpResponse.json({
            data: {
              id: "1",
              name: "サンプルプロジェクト",
              description: "プロジェクトの説明",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
            },
          });
        }),
        http.get("*/api/v1/projects/1/members", () => {
          return HttpResponse.json({
            data: [],
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // メンバー追加ボタンをクリック
    const addButton = await canvas.findByRole("button", { name: /メンバーを追加/i });
    await userEvent.click(addButton);

    // ダイアログが表示されることを確認
    const dialog = await canvas.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
  },
};
