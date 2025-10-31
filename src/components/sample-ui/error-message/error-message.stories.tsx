import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorMessage } from "./error-message";

/**
 * ErrorMessageコンポーネントのストーリー
 *
 * エラーメッセージを表示するコンポーネント。
 * フォーム内やページ全体でエラー状態を通知する際に使用します。
 *
 * @example
 * ```tsx
 * <ErrorMessage message="エラーが発生しました。" />
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "components/sample-ui/ErrorMessage",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: ErrorMessage,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: "padded",

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          "エラー状態をユーザーに通知するためのメッセージコンポーネント。\n\n" +
          "**主な機能:**\n" +
          "- カスタムタイトルの設定\n" +
          "- エラーメッセージの表示\n" +
          "- フルスクリーン表示モード\n" +
          "- 視覚的に目立つデザイン\n\n" +
          "**使用場面:**\n" +
          "- フォームバリデーションエラー\n" +
          "- API呼び出しの失敗\n" +
          "- ページ全体のエラー表示\n" +
          "- ネットワークエラー通知",
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
  // コントロールパネルの設定
  // Storybookのコントロールパネルで操作可能なプロパティを定義
  // ================================================================================
  argTypes: {
    title: {
      control: "text",
      description: "エラーのタイトル",
      table: {
        type: { summary: "string" },
        category: "コンテンツ",
      },
    },
    message: {
      control: "text",
      description: "エラーメッセージ",
      table: {
        type: { summary: "string" },
        category: "コンテンツ",
      },
    },
    fullScreen: {
      control: "boolean",
      description: "フルスクリーン表示",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "レイアウト",
      },
    },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのErrorMessage
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    message: "エラーが発生しました。",
  },
  parameters: {
    docs: {
      description: {
        story: "最も基本的なエラーメッセージ。デフォルトのタイトルと指定されたメッセージを表示します。",
      },
    },
  },
};

/**
 * カスタムタイトル
 */
export const CustomTitle: Story = {
  name: "カスタムタイトル",
  args: {
    title: "ログインエラー",
    message: "メールアドレスまたはパスワードが正しくありません。",
  },
  parameters: {
    docs: {
      description: {
        story: "カスタムタイトルを設定したエラーメッセージ。エラーの種類をより明確に伝えることができます。",
      },
    },
  },
};

/**
 * フルスクリーン (Storybookでは表示が制限されます)
 */
export const FullScreen: Story = {
  name: "フルスクリーン",
  args: {
    message: "ページの読み込みに失敗しました。",
    fullScreen: true,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "画面全体を使ってエラーを表示するモード。ページ全体のエラーや致命的なエラーの表示に使用します。",
      },
    },
  },
};

/**
 * フォーム内での使用例
 */
export const InForm: Story = {
  name: "フォーム内",
  args: {
    message: "有効なメールアドレスを入力してください",
  },
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          メールアドレス
        </label>
        <input id="email" type="email" className="w-full px-3 py-2 border rounded-md" defaultValue="invalid-email" />
      </div>
      <ErrorMessage message="有効なメールアドレスを入力してください" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "フォーム内でバリデーションエラーを表示する実用的な例。入力フィールドの下にエラーメッセージを配置しています。",
      },
    },
  },
};
