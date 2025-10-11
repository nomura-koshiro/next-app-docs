import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageLayout } from "./page-layout";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";

const meta = {
  title: "components/layout/PageLayout",
  component: PageLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "4xl", "6xl", "full"],
      description: "コンテンツの最大幅",
    },
  },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのPageLayout
 */
export const Default: Story = {
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <div className="rounded-lg border bg-white p-8">
        <h2 className="text-2xl font-bold">ページコンテンツ</h2>
        <p className="mt-4 text-gray-600">
          ここにページのコンテンツが入ります。
        </p>
      </div>
    </PageLayout>
  ),
};

/**
 * ヘッダー付きレイアウト
 */
export const WithHeader: Story = {
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <PageHeader
        title="ページタイトル"
        description="ページの説明文がここに入ります"
      />
      <div className="rounded-lg border bg-white p-8">
        <p>ページのコンテンツ</p>
      </div>
    </PageLayout>
  ),
};

/**
 * アクション付きヘッダー
 */
export const WithHeaderAction: Story = {
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <PageHeader
        title="ユーザー一覧"
        description="登録されているユーザーの一覧"
        action={<Button>新規作成</Button>}
      />
      <div className="rounded-lg border bg-white p-8">
        <p>ユーザー一覧のコンテンツ</p>
      </div>
    </PageLayout>
  ),
};

/**
 * 小サイズ (sm)
 */
export const SmallWidth: Story = {
  args: {
    children: <div>Dummy content</div>,
    maxWidth: "sm",
  },
  render: () => (
    <PageLayout maxWidth="sm">
      <PageHeader title="小サイズレイアウト" />
      <div className="rounded-lg border bg-white p-8">
        <p>max-width: sm (24rem)</p>
      </div>
    </PageLayout>
  ),
};

/**
 * 中サイズ (md)
 */
export const MediumWidth: Story = {
  args: {
    children: <div>Dummy content</div>,
    maxWidth: "md",
  },
  render: () => (
    <PageLayout maxWidth="md">
      <PageHeader title="中サイズレイアウト" />
      <div className="rounded-lg border bg-white p-8">
        <p>max-width: md (28rem)</p>
      </div>
    </PageLayout>
  ),
};

/**
 * 2XLサイズ (2xl)
 */
export const TwoXLWidth: Story = {
  args: {
    children: <div>Dummy content</div>,
    maxWidth: "2xl",
  },
  render: () => (
    <PageLayout maxWidth="2xl">
      <PageHeader title="2XLサイズレイアウト" />
      <div className="rounded-lg border bg-white p-8">
        <p>max-width: 2xl (42rem)</p>
      </div>
    </PageLayout>
  ),
};

/**
 * 6XLサイズ (6xl) - デフォルト
 */
export const SixXLWidth: Story = {
  args: {
    children: <div>Dummy content</div>,
    maxWidth: "6xl",
  },
  render: () => (
    <PageLayout maxWidth="6xl">
      <PageHeader title="6XLサイズレイアウト (デフォルト)" />
      <div className="rounded-lg border bg-white p-8">
        <p>max-width: 6xl (72rem)</p>
      </div>
    </PageLayout>
  ),
};

/**
 * フルワイド
 */
export const FullWidth: Story = {
  args: {
    children: <div>Dummy content</div>,
    maxWidth: "full",
  },
  render: () => (
    <PageLayout maxWidth="full">
      <PageHeader title="フルワイドレイアウト" />
      <div className="rounded-lg border bg-white p-8">
        <p>max-width: full (制限なし)</p>
      </div>
    </PageLayout>
  ),
};

/**
 * 複数のセクション
 */
export const MultipleSections: Story = {
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <PageHeader
        title="ダッシュボード"
        description="システムの概要と統計情報"
        action={<Button variant="outline">設定</Button>}
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="font-semibold">セクション 1</h3>
          <p className="mt-2 text-gray-600">コンテンツ</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="font-semibold">セクション 2</h3>
          <p className="mt-2 text-gray-600">コンテンツ</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="font-semibold">セクション 3</h3>
          <p className="mt-2 text-gray-600">コンテンツ</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border bg-white p-8">
        <h3 className="text-xl font-semibold">詳細情報</h3>
        <p className="mt-4 text-gray-600">追加のコンテンツがここに入ります。</p>
      </div>
    </PageLayout>
  ),
};

/**
 * すべての幅サイズの比較
 */
export const AllWidths: Story = {
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <p className="mb-2 text-sm font-medium">Small (sm)</p>
        <PageLayout maxWidth="sm">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm">max-width: sm</p>
          </div>
        </PageLayout>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Medium (md)</p>
        <PageLayout maxWidth="md">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm">max-width: md</p>
          </div>
        </PageLayout>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">2XL (2xl)</p>
        <PageLayout maxWidth="2xl">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm">max-width: 2xl</p>
          </div>
        </PageLayout>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">6XL (6xl) - Default</p>
        <PageLayout maxWidth="6xl">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm">max-width: 6xl</p>
          </div>
        </PageLayout>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
