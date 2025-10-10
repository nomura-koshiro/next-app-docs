import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "components/ui/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのSelect
 */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">りんご</SelectItem>
        <SelectItem value="banana">バナナ</SelectItem>
        <SelectItem value="orange">オレンジ</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * グループ付きSelect
 */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="果物を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>果物</SelectLabel>
          <SelectItem value="apple">りんご</SelectItem>
          <SelectItem value="banana">バナナ</SelectItem>
          <SelectItem value="orange">オレンジ</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>野菜</SelectLabel>
          <SelectItem value="carrot">にんじん</SelectItem>
          <SelectItem value="lettuce">レタス</SelectItem>
          <SelectItem value="tomato">トマト</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * 小サイズのSelect
 */
export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]" size="sm">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xs">XS</SelectItem>
        <SelectItem value="s">S</SelectItem>
        <SelectItem value="m">M</SelectItem>
        <SelectItem value="l">L</SelectItem>
        <SelectItem value="xl">XL</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * ラベル付きSelect
 */
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="role" className="text-sm font-medium">
        ロール
      </label>
      <Select>
        <SelectTrigger className="w-[180px]" id="role">
          <SelectValue placeholder="ロールを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">ユーザー</SelectItem>
          <SelectItem value="admin">管理者</SelectItem>
          <SelectItem value="moderator">モデレーター</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * 無効化されたSelect
 */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選択できません" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">オプション1</SelectItem>
        <SelectItem value="option2">オプション2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * フォームでの使用例
 */
export const InForm: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">
          国<span className="text-red-500 ml-1">*</span>
        </label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="国を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jp">日本</SelectItem>
            <SelectItem value="us">アメリカ</SelectItem>
            <SelectItem value="uk">イギリス</SelectItem>
            <SelectItem value="fr">フランス</SelectItem>
            <SelectItem value="de">ドイツ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-medium">
          言語
        </label>
        <Select>
          <SelectTrigger id="language">
            <SelectValue placeholder="言語を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ja">日本語</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="ko">한국어</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
