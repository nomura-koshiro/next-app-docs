import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";

const meta = {
  title: "components/layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "ページタイトル",
    },
    description: {
      control: "text",
      description: "ページの説明文",
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * タイトルのみ
 */
export const TitleOnly: Story = {
  name: "タイトルのみ",
  args: {
    title: "ページタイトル",
  },
};

/**
 * タイトルと説明文
 */
export const WithDescription: Story = {
  name: "説明文付き",
  args: {
    title: "ユーザー管理",
    description: "システムに登録されているユーザーの一覧と管理",
  },
};

/**
 * アクションボタン付き
 */
export const WithAction: Story = {
  name: "アクション付き",
  args: {
    title: "ユーザー一覧",
    description: "登録されているユーザーの一覧",
    action: <Button>新規ユーザー作成</Button>,
  },
};

/**
 * 複数のアクションボタン
 */
export const MultipleActions: Story = {
  name: "複数アクション",
  args: {
    title: "設定",
    description: "アプリケーションの設定を管理",
  },
  render: () => (
    <PageHeader
      title="設定"
      description="アプリケーションの設定を管理"
      action={
        <div className="flex gap-2">
          <Button variant="outline">キャンセル</Button>
          <Button>保存</Button>
        </div>
      }
    />
  ),
};

/**
 * 長いタイトルと説明文の表示確認
 */
export const LongText: Story = {
  name: "長文テキスト",
  args: {
    title: "非常に長いページタイトルの例を示しています",
    description:
      "これは非常に長い説明文の例です。複数行にわたる説明文がどのように表示されるかを確認するためのサンプルテキストです。",
  },
};
