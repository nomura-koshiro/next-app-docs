import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import { Input } from "@/components/ui/input";

const meta = {
  title: "components/ui/Label",
  component: Label,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのLabel
 */
export const Default: Story = {
  args: {
    children: "ラベル",
  },
};

/**
 * Input付きLabel
 */
export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="name">名前</Label>
      <Input id="name" placeholder="山田太郎" />
    </div>
  ),
};

/**
 * 必須マーク付きLabel
 */
export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">
        メールアドレス
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input id="email" type="email" placeholder="user@example.com" />
    </div>
  ),
};

/**
 * 無効化されたLabel
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-2" data-disabled="true">
      <Label htmlFor="disabled">無効化されたフィールド</Label>
      <Input id="disabled" disabled placeholder="入力できません" />
    </div>
  ),
};

/**
 * 複数のフォームフィールド
 */
export const FormFields: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="space-y-2">
        <Label htmlFor="username">
          ユーザー名
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input id="username" placeholder="username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">
          メールアドレス
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input id="email" type="email" placeholder="user@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">自己紹介</Label>
        <textarea
          id="bio"
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
          placeholder="自己紹介を入力してください"
        />
      </div>
    </div>
  ),
};
