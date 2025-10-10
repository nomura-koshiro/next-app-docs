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
 * デフォルトのInput
 */
export const Default: Story = {
  args: {
    placeholder: "テキストを入力してください",
  },
};

/**
 * メールアドレス用Input
 */
export const Email: Story = {
  args: {
    type: "email",
    placeholder: "user@example.com",
  },
};

/**
 * パスワード用Input
 */
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "パスワードを入力",
  },
};

/**
 * 数値用Input
 */
export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
  },
};

/**
 * 無効化されたInput
 */
export const Disabled: Story = {
  args: {
    placeholder: "無効化されています",
    disabled: true,
  },
};

/**
 * 値が入力されたInput
 */
export const WithValue: Story = {
  args: {
    defaultValue: "入力済みの値",
  },
};

/**
 * ラベル付きInput
 */
export const WithLabel: Story = {
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
 * エラー状態のInput
 */
export const WithError: Story = {
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

/**
 * 様々なタイプのInput
 */
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="space-y-2">
        <label className="text-sm font-medium">Text</label>
        <Input type="text" placeholder="テキスト入力" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="user@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="パスワード" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Number</label>
        <Input type="number" placeholder="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tel</label>
        <Input type="tel" placeholder="090-1234-5678" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">URL</label>
        <Input type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
};
