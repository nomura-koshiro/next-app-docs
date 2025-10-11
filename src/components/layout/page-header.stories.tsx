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
  args: {
    title: "ページタイトル",
  },
};

/**
 * タイトルと説明文
 */
export const WithDescription: Story = {
  args: {
    title: "ユーザー管理",
    description: "システムに登録されているユーザーの一覧と管理",
  },
};

/**
 * アクションボタン付き
 */
export const WithAction: Story = {
  args: {
    title: "ユーザー一覧",
    description: "登録されているユーザーの一覧",
    action: <Button>新規ユーザー作成</Button>,
  },
};

/**
 * 複数のアクションボタン
 */
export const WithMultipleActions: Story = {
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
 * 長いタイトルと説明文
 */
export const LongText: Story = {
  args: {
    title: "非常に長いページタイトルの例を示しています",
    description:
      "これは非常に長い説明文の例です。複数行にわたる説明文がどのように表示されるかを確認するためのサンプルテキストです。",
  },
};

/**
 * アイコン付きアクション
 */
export const WithIconAction: Story = {
  args: {
    title: "ダッシュボード",
    description: "システムの概要と統計情報",
  },
  render: () => (
    <PageHeader
      title="ダッシュボード"
      description="システムの概要と統計情報"
      action={
        <Button variant="outline" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          設定
        </Button>
      }
    />
  ),
};

/**
 * 様々なバリエーション
 */
export const AllVariations: Story = {
  args: {
    title: "タイトルのみ",
  },
  render: () => (
    <div className="space-y-8">
      <PageHeader title="タイトルのみ" />
      <PageHeader title="タイトルと説明" description="説明文がここに入ります" />
      <PageHeader
        title="アクション付き"
        description="アクションボタンを配置できます"
        action={<Button size="sm">アクション</Button>}
      />
      <PageHeader
        title="複数のアクション"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              キャンセル
            </Button>
            <Button size="sm">保存</Button>
          </div>
        }
      />
    </div>
  ),
};
