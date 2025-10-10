import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorMessage } from "./error-message";

const meta = {
  title: "components/ui/ErrorMessage",
  component: ErrorMessage,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "エラーのタイトル",
    },
    message: {
      control: "text",
      description: "エラーメッセージ",
    },
    fullScreen: {
      control: "boolean",
      description: "フルスクリーン表示",
    },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのErrorMessage
 */
export const Default: Story = {
  args: {
    message: "エラーが発生しました。",
  },
};

/**
 * カスタムタイトル
 */
export const CustomTitle: Story = {
  args: {
    title: "ログインエラー",
    message: "メールアドレスまたはパスワードが正しくありません。",
  },
};

/**
 * ネットワークエラー
 */
export const NetworkError: Story = {
  args: {
    title: "ネットワークエラー",
    message:
      "サーバーに接続できませんでした。インターネット接続を確認してください。",
  },
};

/**
 * バリデーションエラー
 */
export const ValidationError: Story = {
  args: {
    title: "入力エラー",
    message: "必須項目を全て入力してください。",
  },
};

/**
 * 権限エラー
 */
export const PermissionError: Story = {
  args: {
    title: "アクセス拒否",
    message: "この操作を実行する権限がありません。",
  },
};

/**
 * フルスクリーン (Storybookでは表示が制限されます)
 */
export const FullScreen: Story = {
  args: {
    message: "ページの読み込みに失敗しました。",
    fullScreen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * フォーム内での使用例
 */
export const InForm: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          defaultValue="invalid-email"
        />
      </div>
      <ErrorMessage message="有効なメールアドレスを入力してください" />
    </div>
  ),
};

/**
 * 複数のエラーメッセージ
 */
export const MultipleErrors: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <ErrorMessage
        title="ネットワークエラー"
        message="サーバーに接続できませんでした。"
      />
      <ErrorMessage
        title="バリデーションエラー"
        message="入力内容に誤りがあります。"
      />
      <ErrorMessage
        title="権限エラー"
        message="この操作を実行する権限がありません。"
      />
    </div>
  ),
};
