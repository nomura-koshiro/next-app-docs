import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { Control, useForm } from "react-hook-form";

import { loginFormSchema, type LoginFormValues } from "@/features/sample-auth/types/forms";

import { LoginForm } from "./login";

/**
 * LoginFormコンポーネントのストーリー
 *
 * ログインフォームコンポーネント。メールアドレスとパスワードによる認証を行います。
 * React Hook FormとZodによるバリデーションが統合されています。
 *
 * @example
 * ```tsx
 * <LoginForm
 *   control={control}
 *   onSubmit={handleSubmit}
 *   errors={errors}
 *   isSubmitting={false}
 * />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "features/sample-auth/routes/sample-login/components/LoginForm",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: LoginForm,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: "fullscreen",

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          "ユーザー認証のためのログインフォームコンポーネント。メールアドレスとパスワードによる認証を提供します。\n\n" +
          "**主な機能:**\n" +
          "- メールアドレスとパスワードの入力\n" +
          "- React Hook Formによる制御\n" +
          "- Zodスキーマによるバリデーション\n" +
          "- ローディング状態の表示\n" +
          "- エラーメッセージの表示\n\n" +
          "**使用場面:**\n" +
          "- ログインページ\n" +
          "- 認証が必要な機能へのアクセス前",
      },
    },

    // ================================================================================
    // アクション設定
    // on* で始まるプロパティを自動的にアクションパネルに表示
    // ================================================================================
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],

  // ================================================================================
  // デフォルトの args 値
  // すべてのストーリーに適用されるデフォルト値
  // 個々のストーリーで上書き可能
  // ================================================================================
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ログインフォームの初期状態
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    return (
      <LoginForm control={form.control} onSubmit={args.onSubmit} errors={form.formState.errors} isSubmitting={false} idPrefix="default" />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "ログインフォームの初期状態。メールアドレスとパスワードの入力フィールドが表示されます。",
      },
    },
  },
};

/**
 * ログイン中状態
 * ログイン処理中でボタンが無効化されている状態
 */
export const Loading: Story = {
  name: "ローディング中",
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isSubmitting: true,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "user@example.com",
        password: "password123",
      },
    });

    return (
      <LoginForm control={form.control} onSubmit={args.onSubmit} errors={form.formState.errors} isSubmitting={true} idPrefix="loading" />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "ログイン処理中の状態。送信ボタンが無効化され、ローディングインジケーターが表示されます。",
      },
    },
  },
};

/**
 * エラー状態
 * ログインに失敗してエラーメッセージが表示されている状態
 */
export const WithError: Story = {
  name: "エラー",
  args: {
    control: {} as Control<LoginFormValues>,
    onSubmit: fn(),
    errors: {},
    isSubmitting: false,
  },
  render: (args) => {
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "user@example.com",
        password: "wrongpassword",
      },
    });

    const errors = {
      root: {
        message: "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        type: "manual" as const,
      },
    };

    return <LoginForm control={form.control} onSubmit={args.onSubmit} errors={errors} isSubmitting={false} idPrefix="error" />;
  },
  parameters: {
    docs: {
      description: {
        story: "ログイン失敗時の状態。エラーメッセージが表示され、ユーザーに認証情報の確認を促します。",
      },
    },
  },
};
