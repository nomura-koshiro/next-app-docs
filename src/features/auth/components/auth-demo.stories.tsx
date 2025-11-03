// ================================================================================
// Imports
// ================================================================================

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "@storybook/test";
import { delay, http, HttpResponse } from "msw";
import React from "react";

import { MOCK_AUTH } from "@/mocks/handlers/api/v1/auth/auth-handlers";

import { AuthDemo } from "./auth-demo";
import {
  authenticatedLoader,
  setAuthenticatedState,
  setAuthenticatedStorage,
  setUnauthenticatedState,
  setUnauthenticatedStorage,
  unauthenticatedLoader,
} from "./storybook-helpers";

// ================================================================================
// デコレーター
// ================================================================================

/**
 * 認証済み状態を維持するデコレーター
 *
 * ストーリーの初期化時にsessionStorageとZustandストアを認証済み状態に設定します。
 *
 * @param story - レンダリングするストーリーコンポーネント
 * @returns デコレートされたストーリー要素
 */
const AuthenticatedDecorator = (story: () => React.ReactElement) => {
  console.log("[AuthenticatedDecorator] Called");

  React.useEffect(() => {
    console.log("[AuthenticatedDecorator] useEffect - setting authenticated state");
    setAuthenticatedStorage();
  }, []);

  return story();
};

/**
 * 未認証状態を維持するデコレーター
 *
 * ストーリーの初期化時にsessionStorageとZustandストアを未認証状態に設定します。
 *
 * @param story - レンダリングするストーリーコンポーネント
 * @returns デコレートされたストーリー要素
 */
const UnauthenticatedDecorator = (story: () => React.ReactElement) => {
  console.log("[UnauthenticatedDecorator] Called");

  React.useEffect(() => {
    console.log("[UnauthenticatedDecorator] useEffect - setting unauthenticated state");
    setUnauthenticatedStorage();
  }, []);

  return story();
};

// ================================================================================
// メタデータ
// ================================================================================

/**
 * 認証デモコンポーネントのストーリー
 *
 * useAuthフックの動作を確認するためのデモコンポーネントのストーリー。
 * 認証状態の切り替え、ユーザー情報の表示、ログイン/ログアウト操作をテストします。
 */
const meta = {
  title: "features/auth/components/AuthDemo",
  component: AuthDemo,

  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
    docs: {
      description: {
        component:
          "認証フック（useAuth）の動作を視覚的に確認するためのデモコンポーネント。\n\n" +
          "**主な機能:**\n" +
          "- 認証状態の表示（認証済み/未認証）\n" +
          "- ユーザー情報の表示（名前、メール、Azure OID、ロール）\n" +
          "- ログイン/ログアウト機能\n" +
          "- ローディング状態の表示\n" +
          "- 開発モード/本番モードの切り替え対応\n\n" +
          "**使用フック:**\n" +
          "- `useAuth()`: 認証状態とユーザー情報を管理\n\n" +
          "**使用場面:**\n" +
          "- 認証機能の動作確認\n" +
          "- useAuthフックのテスト\n" +
          "- 認証フローのデモンストレーション",
      },
    },
    msw: {
      handlers: [
        http.get("*/auth/me", async ({ request }) => {
          const authHeader = request.headers.get("Authorization");
          if (!authHeader || !authHeader.includes("mock-access-token")) {
            return HttpResponse.json({ detail: "Unauthorized" }, { status: 401 });
          }
          await delay(300);

          return HttpResponse.json(MOCK_AUTH.USER);
        }),
      ],
    },
  },

  tags: ["autodocs"],
} satisfies Meta<typeof AuthDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// ================================================================================
// ストーリー定義
// ================================================================================

/**
 * デフォルトストーリー（認証済み状態）
 *
 * 開発モードでのデフォルト状態を表示します。
 * 自動的にモックユーザーとして認証され、ユーザー情報が表示されます。
 */
export const Default: Story = {
  name: "デフォルト（認証済み）",
  decorators: [AuthenticatedDecorator],
  loaders: [authenticatedLoader],
  parameters: {
    docs: {
      description: {
        story:
          "開発モード（`AUTH_MODE=development`）でのデフォルト状態。\n\n" +
          "自動的にモックユーザーとして認証され、ユーザー情報が表示されます。",
      },
    },
  },
  play: async () => {
    setAuthenticatedState();
  },
};

/**
 * 未認証ストーリー
 *
 * ログアウト後の未認証状態を表示します。
 * ログインボタンが表示され、ログイン操作が可能です。
 */
export const Unauthenticated: Story = {
  name: "未認証",
  decorators: [UnauthenticatedDecorator],
  loaders: [unauthenticatedLoader],
  parameters: {
    docs: {
      description: {
        story: "ログアウト後の未認証状態。ログインボタンが表示されます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    setUnauthenticatedState();

    const canvas = within(canvasElement);
    expect(await canvas.findByText("未認証")).toBeInTheDocument();
    expect(await canvas.findByRole("button", { name: /ログイン/i })).toBeInTheDocument();
  },
};

/**
 * ログイン操作ストーリー
 *
 * ログインボタンをクリックする操作をテストします。
 * 開発モードでは即座にモックユーザーとして認証されます。
 */
export const LoginAction: Story = {
  name: "ログイン操作",
  decorators: [UnauthenticatedDecorator],
  loaders: [unauthenticatedLoader],
  parameters: {
    docs: {
      description: {
        story:
          "ログインボタンをクリックすると、開発モードでは即座にモックユーザーとして認証されます。\n\n" +
          "本番モードでは、Azure Entra IDの認証ページにリダイレクトされます。",
      },
    },
  },
  play: async ({ canvasElement }) => {
    setUnauthenticatedState();

    const canvas = within(canvasElement);
    expect(await canvas.findByText("未認証")).toBeInTheDocument();

    const loginButton = await canvas.findByRole("button", { name: /ログイン/i });
    await userEvent.click(loginButton);

    expect(await canvas.findByText("認証済み")).toBeInTheDocument();
    expect(await canvas.findByText("Development User")).toBeInTheDocument();
  },
};

/**
 * ユーザー情報表示ストーリー
 *
 * 認証済みユーザーの詳細情報を表示します。
 * 名前、メールアドレス、Azure Object ID、ロールなどの情報が表示されます。
 */
export const UserInfoDisplay: Story = {
  name: "ユーザー情報表示",
  decorators: [AuthenticatedDecorator],
  loaders: [authenticatedLoader],
  parameters: {
    docs: {
      description: {
        story:
          "認証済みユーザーの詳細情報を表示します。\n\n" +
          "**表示される情報:**\n" +
          "- 名前\n" +
          "- メールアドレス\n" +
          "- Azure Object ID\n" +
          "- ロール（権限）",
      },
    },
  },
  play: async ({ canvasElement }) => {
    setAuthenticatedState();

    const canvas = within(canvasElement);
    expect(await canvas.findByText("Development User")).toBeInTheDocument();
    expect(await canvas.findByText("dev.user@example.com")).toBeInTheDocument();
    expect(await canvas.findByText("dev-azure-oid-12345")).toBeInTheDocument();
    expect(await canvas.findByText("User")).toBeInTheDocument();
  },
};

/**
 * APIエラーストーリー
 *
 * バックエンドAPIからユーザー情報の取得に失敗した場合の状態を表示します。
 * エラーハンドリングの動作を確認できます。
 */
export const APIError: Story = {
  name: "APIエラー",
  decorators: [AuthenticatedDecorator],
  loaders: [authenticatedLoader],
  parameters: {
    docs: {
      description: {
        story: "バックエンドAPIからユーザー情報の取得に失敗した場合の状態。\n\n" + "エラーハンドリングの動作を確認できます。",
      },
    },
    msw: {
      handlers: [
        http.get("*/auth/me", async () => {
          await delay(300);

          return HttpResponse.json({ detail: "Internal Server Error" }, { status: 500 });
        }),
      ],
    },
  },
};
