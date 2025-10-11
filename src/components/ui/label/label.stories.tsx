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
  name: "デフォルト",
  args: {
    children: "ラベル",
  },
};

/**
 * Input付きLabel
 */
export const WithInput: Story = {
  name: "入力フィールド付き",
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
  name: "必須",
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
  name: "無効",
  render: () => (
    <div className="space-y-2" data-disabled="true">
      <Label htmlFor="disabled">無効化されたフィールド</Label>
      <Input id="disabled" disabled placeholder="入力できません" />
    </div>
  ),
};
