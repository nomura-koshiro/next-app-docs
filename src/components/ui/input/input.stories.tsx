import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "components/ui/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
      description: "入力フィールドのタイプ",
    },
    placeholder: {
      control: "text",
      description: "プレースホルダーテキスト",
    },
    disabled: {
      control: "boolean",
      description: "無効化状態",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのテキスト入力
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    placeholder: "テキストを入力してください",
  },
};

/**
 * メールアドレス入力
 */
export const Email: Story = {
  name: "メール",
  args: {
    type: "email",
    placeholder: "user@example.com",
  },
};

/**
 * パスワード入力
 */
export const Password: Story = {
  name: "パスワード",
  args: {
    type: "password",
    placeholder: "パスワードを入力",
  },
};

/**
 * 数値入力
 */
export const Number: Story = {
  name: "数値",
  args: {
    type: "number",
    placeholder: "0",
  },
};

/**
 * 無効化状態
 */
export const Disabled: Story = {
  name: "無効化",
  args: {
    placeholder: "無効化されています",
    disabled: true,
  },
};

/**
 * 初期値あり
 */
export const WithDefaultValue: Story = {
  name: "初期値あり",
  args: {
    defaultValue: "入力済みの値",
  },
};

/**
 * ラベルとの組み合わせ
 */
export const WithLabel: Story = {
  name: "ラベル付き",
  render: () => (
    <div className="space-y-2">
      <label htmlFor="name" className="text-sm font-medium">
        名前
      </label>
      <Input id="name" placeholder="山田太郎" />
    </div>
  ),
};

/**
 * エラー表示
 */
export const WithError: Story = {
  name: "エラー",
  render: () => (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        メールアドレス
      </label>
      <Input
        id="email"
        type="email"
        placeholder="user@example.com"
        aria-invalid="true"
      />
      <p className="text-sm text-red-500">
        有効なメールアドレスを入力してください
      </p>
    </div>
  ),
};
