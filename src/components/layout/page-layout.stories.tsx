import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/sample-ui/button";

import { PageHeader } from "./page-header";
import { PageLayout } from "./page-layout";

/**
 * PageLayoutコンポーネントのストーリー
 *
 * ページ全体のレイアウトを提供するコンポーネント。
 * コンテンツの最大幅を制御し、一貫したページ構造を実現します。
 *
 * @example
 * ```tsx
 * <PageLayout maxWidth="lg">
 *   <PageHeader title="ページタイトル" />
 *   <div>コンテンツ</div>
 * </PageLayout>
 * ```
 */
const meta = {
  // ================================================================================
  // Storybookのナビゲーション階層
  // ================================================================================
  title: "components/layout/PageLayout",

  // ================================================================================
  // 表示するコンポーネント
  // ================================================================================
  component: PageLayout,

  parameters: {
    // ================================================================================
    // レイアウト設定
    // - "centered": コンポーネントを画面中央に配置（小さなUIコンポーネント向け）
    // - "padded": 周囲にパディングを追加（フォームやカード向け）
    // - "fullscreen": 全画面表示（ページレイアウト向け）
    // ================================================================================
    layout: "fullscreen",

    // ================================================================================
    // コンポーネントの詳細説明
    // Markdown形式で記述可能
    // ================================================================================
    docs: {
      description: {
        component:
          "ページ全体のレイアウトを管理するコンテナコンポーネント。コンテンツの最大幅を制御し、一貫したページ構造を提供します。\n\n" +
          "**主な機能:**\n" +
          "- コンテンツの最大幅制御\n" +
          "- 中央揃えレイアウト\n" +
          "- パディングの管理\n" +
          "- レスポンシブ対応\n\n" +
          "**使用場面:**\n" +
          "- すべてのページのルートコンテナ\n" +
          "- ページコンテンツのラッピング\n" +
          "- 一貫したレイアウトの維持",
      },
    },

    // ================================================================================
    // アクション設定
    // on* で始まるプロパティを自動的にアクションパネルに表示
    // ================================================================================
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
  },

  // ================================================================================
  // ドキュメント自動生成を有効化
  // ================================================================================
  tags: ["autodocs"],

  // ================================================================================
  // コントロールパネルの設定
  // Storybookのコントロールパネルで操作可能なプロパティを定義
  // ================================================================================
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "4xl", "6xl", "full"],
      description: "コンテンツの最大幅",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "6xl" },
        category: "レイアウト",
      },
    },
    children: {
      control: false,
      description: "ページのコンテンツ",
      table: {
        type: { summary: "ReactNode" },
        category: "コンテンツ",
      },
    },
  },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのページレイアウト
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <div className="rounded-lg border bg-white p-8">
        <h2 className="text-2xl font-bold">ページコンテンツ</h2>
        <p className="mt-4 text-gray-600">ここにページのコンテンツが入ります。</p>
      </div>
    </PageLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "最も基本的なページレイアウト。デフォルトの最大幅（6xl）でコンテンツが表示されます。",
      },
    },
  },
};

/**
 * ヘッダー付き
 */
export const WithHeader: Story = {
  name: "ヘッダー付き",
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <PageHeader title="ページタイトル" description="ページの説明文がここに入ります" />
      <div className="rounded-lg border bg-white p-8">
        <p>ページのコンテンツ</p>
      </div>
    </PageLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "PageHeaderを組み合わせた実用的な例。ヘッダーとコンテンツが適切に配置されます。",
      },
    },
  },
};

/**
 * アクション付きヘッダー
 */
export const WithActionHeader: Story = {
  name: "アクション付きヘッダー",
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <PageHeader title="ユーザー一覧" description="登録されているユーザーの一覧" action={<Button>新規作成</Button>} />
      <div className="rounded-lg border bg-white p-8">
        <p>ユーザー一覧のコンテンツ</p>
      </div>
    </PageLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "アクションボタン付きヘッダーを持つページレイアウト。一覧ページでよく使われる構成です。",
      },
    },
  },
};

/**
 * 幅指定 (中サイズ)
 */
export const WithWidth: Story = {
  name: "幅指定",
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
  parameters: {
    docs: {
      description: {
        story: "最大幅を指定したレイアウト。フォームや詳細ページなど、幅を狭めたい場合に使用します。",
      },
    },
  },
};

/**
 * フルワイド
 */
export const FullWidth: Story = {
  name: "フルワイド",
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
  parameters: {
    docs: {
      description: {
        story: "最大幅制限なしのフルワイドレイアウト。ダッシュボードや複雑なUIを持つページに適しています。",
      },
    },
  },
};

/**
 * 複数セクション
 */
export const MultipleSections: Story = {
  name: "複数セクション",
  args: {
    children: <div>Dummy content</div>,
  },
  render: () => (
    <PageLayout>
      <PageHeader title="ダッシュボード" description="システムの概要と統計情報" action={<Button variant="outline">設定</Button>} />
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
  parameters: {
    docs: {
      description: {
        story: "複数のセクションを持つページレイアウトの例。ダッシュボードのような複雑なページ構成を実現します。",
      },
    },
  },
};
