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
  name: "デフォルト",
  args: {
    message: "エラーが発生しました。",
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
